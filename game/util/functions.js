function cap (n, upperBound, lowerBound) {
	if (upperBound && n > upperBound) return upperBound;
	if (lowerBound && n < lowerBound) return lowerBound;
	return n;
}
