"use strict";

// Vincent Vencill
// Lab 10 - Data Structures
// Maze Generator/Solver

var R = [], W = [], K = [], A = []; 
var topEntrance; 
var bottom;
var stepTime = 100; // Time in milliseconds to do a step in maze
var nr = 10; // Size of maze
var nc = nr;
var delay = 128;
var activeTimeout;
var moves = [];

//Main part starts here.
function main(){	
	for(var i = 0; i<nr; i++){
		var tmp=[];
		for(var j = 0; j< nc; j++){
			var data1 = [i,j,'e'];  // East vertical wall
			var data2 = [i,j,'s'];	// South horizontal wall
			var data3 = [i,j,'w'];	// West vertical wall
			var data4 = [i,j,'n'];	// North horizontal wall
			tmp.push(new sortedSet(comparator, [i,j])); //creates the sorted sets.			
			if(i < nr -1){
				W.push(data2);
			}
			if (j < nc -1){
				W.push(data1);
			}
			if(i === 0){
				K.push(data4);
			}
			if(i === nr -1){
				K.push(data2);
			}			
			if(j === nc-1){
				K.push(data1);
			}
			if(j === 0){
				K.push(data3);
			}
		}
		R.push(tmp);
	}	
	shuffle(W);	
	while(R[0][0].size() < (nr*nc)){
		var w = W.pop();		
		var i1 = w[0],  j1 = w[1]; //Set on the Left or Above the line.		
		if(w[2] === "e"){		
			var i2 = w[0], j2 = w[1]+1;} //Set on the Right of the line			
		else if(w[2] === "s"){ var i2 = w[0] +1, j2 = w[1];} //Set Below the line.		
		if(!R[i1][j1].contains([i2,j2])){
			var Q = R[i1][j1].union(R[i2][j2]);			
			for(var q =0; q < Q.A.length; q++){				
				var r = Q.A[q][0];
				var c = Q.A[q][1];				
				R[r][c] = Q;
			}
		}
		else K.push(w);
	}
	randomEntrance(K);	
	draw(K, "black");	
	draw(W, "black");
	for(var i = 0; i<nr; ++i){
		A.push([]);
		for(var j = 0; j<nc; ++j){
			A[A.length -1].push([false, false, false, false, 0]);
		}
	}	
	order(K, A);
	order(W, A);
}

function order(K,A){
	for(var q = 0; q<K.length; q++){
		var i = K[q][0];
		var j = K[q][1];
		if(K[q][2] === 'n')
			A[i][j][0] = true;
		else if(K[q][2] === 'e')
			A[i][j][1] = true;
		else if(K[q][2] === 's')
			A[i][j][2] = true;		
		else if(K[q][2] === 'w')
			A[i][j][3] = true;
	}
}

function solve(A, i, j){	
	A[i][j][4] = 1;
	moves.push([i,j,'cyan']);
	if(i === bottom[0][0] && j === bottom[0][1]){		
		drawPath();
		draw(K, "black");	
		draw(W, "black");
		
		return true;
	}	
	if(i > 0){
		if(A[i-1][j][2] === false && A[i-1][j][4] === 0  ){   //North  Up
			if(solve(A,i-1, j)){
				
				return true;
			}			
		}
	}
	if(j < nc-1){		
		if(A[i][j][1] === false && A[i][j+1][4] === 0 ){     //East   Right
			if(solve(A,i,j+1)){
				
				return true;
			}			
		}
	}
	if(i < nr-1){
		if(A[i][j][2] === false && A[i+1][j][4] === 0 ){     //South   Down
			if(solve(A,i+1, j)){
				
				return true;
			}					
		}
	}
	if(j > 0){
		if(A[i][j-1][1] === false && A[i][j-1][4] === 0  ){   //West  Left
			if(solve(A,i,j-1)){
				
				return true;
			}			
		}
	}	
	A[i][j][4] = 2;
	moves.push([i,j,'white']);
	return false;
}

var k = 0;

function drawPath(){
	var cvs = document.getElementById("cvs");
	var ctx = cvs.getContext("2d");	
	var ww = cvs.width/nc;
	var wh = cvs.height/nr;
	if(k < moves.length){
			var i = moves[k][0];
			var j = moves[k][1];
			if(moves[k][2] === 'cyan'){
			// Draw light green path
				ctx.fillStyle = 'cyan';
				ctx.fillRect(j * ww, i * wh, ww, wh);
			}
			else if(moves[k][2] === 'white'){		
			// Draw over wrong path
				ctx.fillStyle = 'white';
				ctx.fillRect(j * ww - 1, i * wh - 1, ww + 1, wh + 1);
			}
			k++;
	}
	setTimeout(drawPath, stepTime);
	draw(W, "black");
	draw(K, "black");
}

function pauseComp(millis){
	var date = new Date();
	var curDate = null;
	do{ 
		curDate = new Date(); 
	}	
	while(curDate-date < millis);
} 


function draw(K, color){	
	color = color;
	var cvs = document.getElementById("cvs");
	var ctx = cvs.getContext("2d");
	ctx.fillStyle="rgb(250,0,250)";		
	ctx.beginPath();
	var ww = cvs.width/nc;
	var wh = cvs.height/nr;
	ctx.strokeStyle=color;
	for(var k in K){
		var r = K[k][0];
		var c = K[k][1];
		var x = (ww * c);
		var y = (wh * r);		
		if(K[k][2] === 's'){  			//horizontal bottom wall		
			y = y + wh;
			var x2 = x +ww ;
			var y2 = y;
		}
		else if(K[k][2] === "e"){		//vertical right wall			
			x = x + ww;
			var x2 = x;
			var y2 = y + wh;
		}
		else if(K[k][2] === "w"){  		//veritcal left wall
			var x2 = x;
			var y2 = y + wh;		
		}
		else if(K[k][2] === "n"){		//horizontal topEntrance wall
			var x2 = x + ww;
			var y2 = y;		
		}
		else throw "Oh boy... What you break now?";	
		ctx.moveTo(x,y);
		ctx.lineTo(x2,y2);		
	}
	ctx.stroke();
	ctx.stroke();
}

function randomEntrance(wall){	
	var keepers1 = [];
	var keepers2 = [];
	for(var h in wall){		
		if(wall[h][0] === 0 && wall[h][2] === 'n'){
			keepers1.push([h]);
		}
	}
	shuffle(keepers1);
	topEntrance = keepers1.pop();	
	topEntrance = wall.splice(topEntrance, 1);		
	for(var k in wall){
		if(wall[k][0] === nr -1 && wall[k][2] === 's'){
			keepers2.push([k]);
		}
	}
	shuffle(keepers2);	
	bottom = keepers2.pop();		
	bottom = wall.splice(bottom,1);	
}

function shuffle(List){
	for(var a = 0; a<List.length; a++){
		var i = randomRange(a, List.length);
		i = Math.floor(i);
		var tmp = List[a];
		List[a] = List[i];
		List[i] = tmp;		
	}	
}

function randomRange(i, j){
	var d = j - i;
	var q = Math.random() * d;	
	return q + i;	
	}
	
function comparator(x1, x2){	
	if(x1[0]>x2[0] ){ return 1; }	
	else if(x1[0] === x2[0] && x1[1] > x2[1]){  return 1; }	
	else if(x1[0] === x2[0] && x1[1] === x2[1]) { return 0;}	
	else{ return -1;}	
}