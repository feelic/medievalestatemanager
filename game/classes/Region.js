function Region () {

	this.plots = [];

	this.addPlot = function (p) {
		if (!r.containsPlot(p.id)) this.plots.push(p);
	}

	this.containsPlot = function (plotId) {
		for (var i = 0; i < this.plots.length; i++){
			if (this.plots.id == plotId ) return true;
		}
		return false;
	}
}
