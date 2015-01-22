/*
 * get a random integer somewhat according to a poisson law
 * n is the median
 * amplitude is the maximum value from which n can vary
 * f is the rarity of extreme results factor (the bigger the f, the rarest the extreme results) 
 */
function getRandomPoissonedAround (n, amplitude, f) {
	var result = 0;
	for (var i = 0; i<f; i++) {
		result += randomIntFromInterval(n-amplitude,n+amplitude)
	}
	return Math.floor(result/f);
}

/*
 * get a random integer between min and max
 */
function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

/*
 * returns a random boolean according to a 0 - 1 float 
 * r = 0.9 means 90% of true results
 */
function randomBoolFromRate(r) {
	if(Math.random()>r) return false;
	else return true;
}

/*
 * Random color ;)
 */
function randomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
	color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}
