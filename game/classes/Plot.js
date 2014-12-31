function Plot (cell) {

	this.id = null;

	this.cell = cell;
	this.cell.ownerObject = this;

	this.plotTypes = [ "forest", "moors", "plains", "coast", "hills", "arid" ];
	this.type = "";
	
	this.surface = 0;
	this.baseHumidity = 0;

	this.owner = null;
	this.plot = null;
	this.population = [];

	this.buildings = [];

	this.exploitationTypes = ["agriculture", "herding", "foresting", "quarry", "mining"] ;
	this.exploitationType = "";

	this.soilQuality = 100;
	this.forestation = 80;
	this.mineralResources = {
		"C" : 0,
		"Fe" : 0,
		"Cu" : 0,
		"Ag" : 0,
		"Au" : 0
	};

	this.naturalRegrowth = function () {

		var ffactor = 1.1;
		var sfactor = 1.1;

		//humidity
		if ( ((this.baseHumidity + this.region.humidity)/2) >= 60) {
			ffactor += 0.1;
			sfactor += 0.1;
		}
		else if ( ((this.baseHumidity + this.region.humidity)/2) >= 30) { 
			ffactor += 0.2;
			sfactor += 0.1;
		}

		//current forestation
		ffactor = (ffactor * 100) / this.forestation;

		//pop density
		switch(this.manager.getPopDensityBracket()) {
			case 'high': 
				ffactor -= 0.1;
				sfactor -= 0.1;
				break;
			case 'medium': 
				break;
			case 'low': 
				ffactor += 0.1;
				sfactor += 0.1;
				break;
		}

		//Cattle presence => good for the soil, but bad for the forests ? 
		//TODO
		
		this.forestation = this.forestation * ffactor; 
		this.soilQuality = this.soilQuality * sfactor; 
	};

	this.setManager = function (m) {
		this.manager = m;
		m.plot = this;
	};
	
	this.setRegion = function (r) {
		this.region = r;
		r.addPlot(this);
	};

	this.getSurface = function () {
		if (this.surface) return this.surface;
		else {
			this.surface = this.cell.getArea();
			return this.surface;
		}
	};

	this.getPop = function () {
		return this.population.length;
	};

	this.getPopDensity = function () {
		return this.getSurface() / this.getPop();
	};

	this.getPopDensityBracket = function () {
		var d = this.getPopDensity();
		if (d > 20) return 'high';
		else if (d > 10) return 'medium';
		else return 'low';
	};
	
	this.seasonChange = function () {
		//Pop has babies
		for (var i = 0; i < this.population.length; i++){
			this.population[i].haveChild();
		}
	};

	/*
	 * Updates the cells rendering parameters
	 */
	this.getRenderingParameters = function () {
		return {
			"forestation" : this.forestation
		};
	};
}
