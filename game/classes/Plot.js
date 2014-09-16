function Plot () {

	this.id;

	this.plotTypes = [ "forest", "moors", "plains", "coast", "hills", "arid" ];
	this.type = "";
	
	this.surface;
	this.baseHumidity;

	this.region;

	this.manager;

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
		ffactor = (ffactor * 100) / this.forestation

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
		};

		//présence de bétail = mauvais pour les arbres, bon pour le terreau (?)
		//TODO
		
		this.forestation = this.forestation * ffactor; 
		this.soilQuality = this.soilQuality * sfactor; 
	}

	this.setManager = function (m) {
		this.manager = m;
		m.plot = this;
	}
	
	this.setRegion = function (r) {
		this.region = r;
		r.addPlot(this);
	}
}
