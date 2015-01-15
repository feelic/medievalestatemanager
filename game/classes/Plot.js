function Plot (cell, game) {

	var game = game;

	this.cell = cell;
	this.id = this.cell.id;
	this.cell.ownerObject = this;

	this.plotTypes = [ "forest", "moors", "plains", "coast", "hills", "arid" ];
	this.type = "";
	
	this.surface = Math.abs(Math.round(this.cell.getArea()));
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

		var ffactor = 1.01;
		var sfactor = 1.01;

		var humidity = this.baseHumidity + game.time.weather.humidity;

		//humidity
		if ( (humidity / 2) >= 60 ) {
			ffactor += 0.02;
			sfactor += 0.02;
		}
		else if ( (humidity / 2) >= 30 ) { 
			ffactor += 0.01;
			sfactor += 0.01;
		}
		else if ( (humidity / 2) < 10 ) {
			ffactor -= 0.02;
			sfactor -= 0.01;		
		}

		//current forestation
		if (this.forestation > 80) ffactor += 0.01

		//pop density
		switch(this.getPopDensityBracket()) {
			case 'high': 
				ffactor -= 0.01;
				sfactor -= 0.01;
				break;
			case 'medium': 
				break;
			case 'low': 
				ffactor += 0.01;
				sfactor += 0.01;
				break;
		}
		console.log(ffactor)
		//Cattle presence => good for the soil, but bad for the forests ? 

		//TODO
		this.forestation = cap(Math.floor(this.forestation * ffactor*10)/10, 100, 0); 
		this.soilQuality = cap(Math.floor(this.soilQuality * sfactor*10)/10, 100, 0);  
	};
	
	this.setRegion = function (r) {
		this.region = r;
		r.addPlot(this);
	};

	this.getPop = function () {
		return this.population.length;
	};

	this.getPopDensity = function () {
		if (this.getPop() == 0) return 0
		else return this.surface / this.getPop();
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
		this.naturalRegrowth();
	};

	/*
	 * Updates the cells rendering parameters
	 */
	this.getRenderingParameters = function () {
		return {
			"forestation" : this.forestation
		};
	};

	this.displayDetails = function () {
		var d = "<div>";
		d += "<p>id: "+this.id+"</p>";
		d += "<p>area: "+this.surface+"</p>";
		d += "<p>population: "+this.getPop()+"</p>";
		d += "<p>forestation: "+this.forestation+" %</p>";
		d += "<p>soil quality: "+this.soilQuality+" %</p>";
		d += "</div>";
		return d;
	}
}
