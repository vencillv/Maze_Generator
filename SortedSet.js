"use strict";

// Vincent Vencill
// Lab 10 - Data Structures - Sorted Set Class

function sortedSet(cmp, x){
	this.cmp = cmp;
	this.A =((x === undefined)? []:[x]);
}

sortedSet.prototype.size = function(){
	return this.A.length;
}

sortedSet.prototype.contains = function(x){	
	var L = 0;
	var R = this.A.length;
	while(L < R){
		var i = Math.floor((R+L)/2);		
		var cr = this.cmp(x, this.A[i]);
		if(cr === 0) {return true;}
		else if(cr < 0) R = i;
		else L = i+1;
	}
	return false;
}

sortedSet.prototype.union = function(S){
	var L = new sortedSet(this.cmp);
	var i = 0;
	var j = 0;
	while(i < this.A.length && j < S.A.length){
		var e1 = this.A[i];
		var e2 = S.A[j];
		var cr = this.cmp(e1, e2);
		if(cr < 0){
			L.A.push(e1);
			i++;
		}
		else if(cr > 0){
			L.A.push(e2);
			j++;
		}
		else{
			L.A.push(e1);
			j++
			i++
		}
	}
	while(i < this.A.length){
		L.A.push(this.A[i++])
	}
	while(j < S.A.length){
		L.A.push(S.A[j++])
	}	
	return L;	
	}
		
sortedSet.prototype.toString = function(){
	return "" + this.A;
}
		
		
		