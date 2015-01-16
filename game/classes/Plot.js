function Plot (cell) {

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
		if (this.cell.height >= 1 ) {
			for (var i = 0; i < this.population.length; i++){
				this.population[i].haveChild();
				//this.population[i].die();
			}

			this.makeMariages();

			this.naturalRegrowth();
		}
		else {

		}
	};

	this.makeMariages = function () {
		var mSingles = [];
		var fSingles = [];
		
		for (var i = 0; i < this.population.length; i++){
			if ( this.population[i].age >= 16 && (!this.population[i].spouse || !this.population[i].spouse.alive) ) {
				if (this.population[i].sex == 'f') fSingles.push(this.population[i]);
				else mSingles.push(this.population[i]);
			}
		}
		var j = 0;
		var k = 0;
		var l = 0;
		while (mSingles.length > 0 && fSingles.length > 0 && l < 50) {
			var p1 = mSingles[j%mSingles.length];
			var p2 = fSingles[k%fSingles.length]
			if ( this.isItAMatch(p1,p2) ) {
				p1.spouse = p2;
				p2.spouse = p1;
				mSingles.splice[mSingles.indexOf(p1),1];
				fSingles.splice[fSingles.indexOf(p2),1];
			}
			else {
				k++;
				l++;
			}
			l++;
		}
	}

	this.isItAMatch = function (p1, p2) {
		if ((!p1.spouse || !p1.spouse.alive) && (!p2.spouse || !p2.spouse.alive) && p1.age > 16 && p2.age > 16 && p1.sex != p2.sex && array_intersection(p1.parents, p2.parents).length === 0) return true // it's a match !
		else return false;
	}

	/*
	 * Updates the cells rendering parameters
	 */
	this.getRenderingParameters = function () {
		return {
			"forestation" : this.forestation
		};
	};

	this.displayDetails = function () {
		var d = '<div>';
		d += "<p>id: "+this.id+"</p>";
		d += "<p>area: "+this.surface+" ha</p>";
		d += "<p>population: "+this.getPop()+"</p>";
		d += "<p>forestation: "+this.forestation+" %</p>";
		d += "<p>soil quality: "+this.soilQuality+" %</p>";
		d += "</div>";
		d += '<div';
		d += this.renderPopList();
		d += "</div>";
		return d;
	}

	this.renderPopList = function (){
		var p = '<ul>';
		for(var i = 0; i < this.population.length; i++) {
			p += '<li><a data-personid="'+this.population[i].id+'">'+this.population[i].name+'</a> ('+this.population[i].age+')</li>';
		}

		p += '</ul>';

		return p;
	}

	this.addStartingPopulation = function (maxCount) {
		if (this.cell.height >= 1) {
			var hfactor = this.height/10;

			for( var i = 1; i < maxCount; i ++ ) {
				var age = 3 + Math.ceil(Math.random()*16);
				var s = ['m','f'];
				var p = new Person({
						'id' : game.people.length,
						'birthDate' : age * -4,
						'age' : age,
						'sex' : s[Math.round(Math.random())],
						'health' : 100,
						'alive' : true,
						'status' : 'OK',
						'residence' : this
					});
				game.people.push(p);

				this.population.push(p);
				if ( 0.1+Math.random() > (3/i + hfactor) ) break;
			}
		}
	}
}
