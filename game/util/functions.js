function cap (n, upperBound, lowerBound) {
	if (upperBound && n > upperBound) return upperBound;
	if (lowerBound && n < lowerBound) return lowerBound;
	return n;
}

function array_intersection(a, b) {
  var result = new Array();
  while( a.length > 0 && b.length > 0 )
  {  
     if      (a[0] < b[0] ){ a.shift(); }
     else if (a[0] > b[0] ){ b.shift(); }
     else /* they're equal */
     {
       result.push(a.shift());
       b.shift();
     }
  }

  return result;
}

function isVowel(c) {
    return ['a','a', 'e','E', 'i', 'I', 'o', 'O', 'u','U', 'é', 'É', 'è', 'È'].indexOf(c) !== -1
}

function average(array) {
	var sum = 0;
	for( var i = 0; i < array.length; i++ ){
		sum += parseInt( array[i], 10 ); //don't forget to add the base
	}

	if (sum > 0) return avg = sum/array.length;
	else return 0;
}

function sum(array) {
	var sum = 0;
	for( var i = 0; i < array.length; i++ ){
		sum += parseInt( array[i], 10 ); 
	}

	return sum;
}
