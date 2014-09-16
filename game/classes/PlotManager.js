function PlotManager () {

	this.owner;
	this.plot;
	this.population = [];

	this.buildings = [];

	this.exploitationTypes = ["agriculture", "herding", "foresting", "quarry", "mining"] ;
	this.exploitationType = "";

	this.setPlot = function (p) {
		this.plot = p;
		p.manager = this;
	}

	this.getPop = function () {
		return this.population.length;
	}

	this.getPopDensity = function () {
		return this.plot.surface / this.getPop();
	}

	this.getPopDensityBracket = function () {
		var d = this.getPopDensity()
		if (d > 20) return 'high';
		else if (d > 10) return 'medium';
		else return 'low';
	}
	
	this.seasonChange = function () {
		//Pop has babies
		for (var i = 0; i < this.population.length; i++){
			this.population[i].haveChild();
		}
	}
}
