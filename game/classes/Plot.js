function Plot (cell) {

	this.cell = cell;
	this.id = this.cell.id;
	this.cell.ownerObject = this;

	this.height = this.cell.height;

	this.biomes = [ "sea","forest", "moors", "plains", "coast", "hills", "arid" ];

	if (this.height <= 0) this.biome = 'sea';
	else if (game.engine.countCoasts(this.cell)>0 && this.height == 1) this.biome = 'coast';
	else if (this.height == 1) this.biome = 'plains';
	else if (this.height == 2) this.biome = 'moors';
	else if (this.height == 3) this.biome = 'hills';
	else if (this.height >= 4) this.biome = 'mountains';
	
	this.types = [ "manor", "city", "tenure", "servile land", "inhabited" ];
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

	this.diseases = {
		"Plague" : {
			"activeEpidemy" : false, 
			"transmissionFactor" : 0.5,
			"stages" : [-20],
			"baseCureChance" : 0.2
		},
		"Leprosy" : {
			"activeEpidemy" : false, 
			"transmissionFactor" : 0.1,
			"stages" : [-10, -5],
			"baseCureChance" : 0.1
		}
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
		//console.log(this.population.length);
		return this.population.length;
	};

	this.getPopDensity = function () {
		var d = 0;
		if (!this.getPop() === 0) d = this.surface / this.getPop();
		return d;
	};

	this.getPopDensityBracket = function () {
		var d = this.getPopDensity();
		if (d > 2000) return 'high';
		else if (d > 1000) return 'medium';
		else return 'low';
	};
	
	this.seasonChange = function () {
		if (this.cell.height >= 1 ) {
			for (var i = 0; i < this.population.length; i++){
				if (this.population[i].alive) {
					this.population[i].mortality();
					this.population[i].haveChild();
				}
			}

			this.makeMariages();

			this.naturalRegrowth();
		}
		else {

		}
	};

	this.makeMariages = function () {
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
				game.time.log.marriages++;
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
		d += "<p>id: "+this.id+" ("+this.biome+")</p>";
		if (this.name) d += "<p>name: "+this.name+"</p>";
		if (this.demesne) d += "<p>part of the "+this.demesne.lord.lastname+" estate</p>";
		d += "<p>height: "+this.height+"</p>";
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
			p += '<li><a data-personid="'+this.population[i].id+'">'+this.population[i].getFullName()+'</a> ('+Math.floor(this.population[i].age)+')</li>';
		}

		p += '</ul>';

		return p;
	}

	this.getNeighbours = function () {
		return this.cell.neighbours;
	}

	this.addStartingPopulation = function (count) {
		if (this.cell.height >= 1 && this.type != 'inhabited') {
			var hfactor = this.height/10;
			var tfactor = 0;
			if (this.type == 'manor') tfactor = 0.2;
			if (this.type == 'city') { tfactor = 0.4; count = count * 2; }

			for( var i = 1; i <count; i ++ ) {
				var age = 3 + Math.ceil(Math.random()*30);
				var s = ['m','f'];
				var p = new Person({
						'birthDate' : age * -4,
						'birthYear' : game.time.startYear - age,
						'age' : age,
						'sex' : s[Math.round(Math.random())],
						'residence' : this
					});

				if ( Math.random() > (count/i + hfactor + tfactor) ) break;
			}
		}
	}

	this.getRenderingParameters = function () {
		var p = {style : {}, data : {}};

		if ( game.displayMode == 'geo' ) {
			//if (this.biome == 'coast') p.style.fill = '#F5DEB3';
		}
		else if ( game.displayMode == 'political' ) {
			if (this.demesne) {
				p.style.fill = this.demesne.color;
			}
			else if (this.biome != 'sea') p.style.fill = '#AAAAAA';
		}

		if (this.type = 'manor') {
			p.data.text = this.name;
			p.style.text = {
				'text-anchor': 'middle',
				'font-size': 24,
				'font-family': 'serif',
				'fill': '#333333',
				'stroke': '#666666',
				'stroke-width': '1',
				'letter-spacing': 1,
				'word-spacing': 1
			}
		}
		return p;
	}
}
