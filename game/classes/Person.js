function Person (data) {
	this.name = null;
	this.lastname = null;

	this.birthDate = null; //Saison de naissance
	this.birthYear = null; //Année de naissance
	this.age = 0;
	this.sex = 'm';
	this.health = 100;
	this.alive = true;
	this.sick = false;
	this.hunger = 0; // 0 is fully fed, 10 is dying of starvation

	this.job = null;
	this.residence = null;

	this.craft = null;
	this.level = null;

	this.parents = [];
	this.spouse = null;
	this.children = [];
	this.pregnant = false;

	/*
	 * Returns false or a New Child entity
	 */
	this.haveChild = function () {
		if ((this.spouse) && (this.spouse.alive) && this.sex == 'f' && this.age >= 15 && this.age <= 45 && ( this.children.length == 0 || this.children[this.children.length-1].wasBornNSeasonsAgo(1.25) ) && this.children.length < 16 && !this.pregnant) {
			var chances = 0.9 * (( 45 - this.age ) / 30);
			if (randomBoolFromRate(chances)) {

				// We need to determine the social status of the child
				var status = 'serf';
				
				var s = ['m','f'];
				var p = new Person({
						'birthDate' : game.time.seasonCounter,
						'birthYear' : game.time.currentYear,
						'sex' : s[Math.round(Math.random())],
						'status' : status,
						'residence' : this.residence,
						'alive' : true,
						'health' : 72
					});

				// probability of stillbirth
				if(randomBoolFromRate(0.25)) p.kill('was dead at birth');

				this.children.push(p);
				this.spouse.children.push(p);
				p.setParents(this, this.spouse);

				//probability of the mother dying in labour
				if (this.health < 25 && randomBoolFromRate(1/6)) this.kill('died in labour');
				else if (this.health < 75 && randomBoolFromRate(1/8)) this.kill('died in labour');
				else if (randomBoolFromRate(1/10)) this.kill('died in labour');

				game.time.log.births++;

				return p;

			}
			else return false;
		}
		else return false;
	};

	this.wasBornNSeasonsAgo = function (n) {
		return (game.time.seasonCounter - this.birthDate >= n );
	}

	/*
	 * Check if the person dies or not :(
	 */
	this.mortality = function () {
		this.age += 0.25;
		var cod = 'unknown';

		if (this.sick) {
			cod = 'died of the '+this.sick.disease;
			this.updateSickness();
		}
		if (this.age < 2) cod = 'died in the craddle';

		if (this.age < 25) this.health = cap(this.health + 5, 100, 0);
		else if (this.age < 30) this.health = cap(this.health + 2, 100, 0);
		else if (this.age < 40) this.health = cap(this.health + 1, 100, 0);
		else if (this.age < 45) this.health = cap(this.health + 0, 100, 0);
		else if (this.age < 50) this.health = cap(this.health - 0.5, 100, 0);
		else this.health = cap(this.health - 1, 100, 0);

		if (!randomBoolFromRate((100+this.health)/200)) this.kill(cod);

	};

	this.updateSickness = function (d) {
		//new disease
		if (d) {
			this.sick = { 'disease' : d, 'stage' : 0 };
		}
		else if (this.sick) {
			// Cured !
			if (getBoolFromRate(game.disease[this.sick.disease].baseCureChance+this.residence.healthCareBonus)) {
				this.sick = false;
			}
			else {
				this.health += game.diseases[this.sick.disease].stages[this.sick.stage];
				this.sick.stage = cap(this.sick.stage + 1, game.diseases[this.sick.disease].stages.length - 1,0);
			}
		}
	}
	/*
	 * Kills the person, adds the cause and logs the death in the game history
	 */
	this.kill = function (cause) {
		this.alive = false;
		this.causeOfDeath = cause;
		game.time.log.deaths++;
		game.time.log.agesOfDeath.push(this.age);
	};

	/*
	 *	Sets Parents
	 */
	this.setParents = function (parentA, parentB) {
		this.parents = [];
		this.parents.push(parentA);
		this.parents.push(parentB);

		if (!this.lastname) this.createName();
	};

	this.setResidence = function (r) {
		//this.residence.pop()
	};

	this.createName = function () {
		if (this.status == 'nobility') this.lastname = game.localisation.getGen(this.residence.name)+ this.residence.name;

		if (this.parents && this.parents.length > 0) {
			this.lastname = this.parents[1].lastname;
		}

		if (! this.name ) this.name = game.localisation.getRandomName(this.sex);
	};

	this.getFullName = function () {
		if(this.lastname) return this.name+' '+this.lastname;
		else return this.name;
	};

	this.isAliveMajorAndSingle = function () {
		// is not dead
		if (!this.alive) return false;
		// too young to marry
		else if(this.age < 15) return false;
		// married and spouse is alive
		else if(this.spouse && this.spouse.alive) return false;
		else return true;
	};

	this.testMigration = function () {	
		var migChance = 0;

		//if adult and unmarried
		if(this.isAliveMajorAndSingle()) migChance += 0.1;		

		//if adult without a job
		if(!this.employment) migChance += 0.1;

		//if hungry
		migChance += this.hunger/10;

		if(randomBoolFromRate(migChance)) this.migrate();
	};

	this.migrate = function (destination) {
		if (!destination) {
			//if no destination is set, we have to find one randomly
			destination = getRandomFromArray(this.residence.getNeighbours());
		}
		//if the person migrates, they go with their family (spouse and young children)
		if(this.spouse && this.spouse.alive) {
			this.spouse.migrate(destination);
		}
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].alive && this.children.age < 15) this.children[i].migrate(destination);
		}

		// TODO actual residence change 
	};

	this.renderDetails = function () {
		var d = '<div>';
		d += '<p>'+this.renderLink()+' ('+Math.floor(this.age)+', '+this.sex+')</p>';

		if (!this.alive) d += '<p>'+this.causeOfDeath+'</p>';

		//parents
		if (this.parents.length == 2) {
			d += '<p>';
			if (this.sex == 'm') d+= 'son of ';
			else d += 'daughter of ';

			d += this.parents[0].renderLink()+' and '+this.parents[1].renderLink()+'</p>';
		}
		//spouse
		if (this.spouse) {
			d += '<p>married to '+this.spouse.renderLink()+'</p>';
		}

		// children
		d += '<table>';
		for(var i = 0; i < this.children.length; i++) {
			d += '<tr><td>'+this.children[i].renderLink()+'</td>';
			d += '<td>('+Math.floor(this.children[i].age)+')</td>';
			d += '<td>';
			if(this.children[i].spouse && this.children[i].spouse.alive) d += 'm';
			else if (this.children[i].spouse) d += 'w';
			d += '</td>';
			d += '</tr>';
			
		}

		d += '</table></div>';

		return d;
	};

	this.renderLink = function () {
		var l = '<a class="person-link ';
		if (!this.alive) l += 'dead';
		l += '" data-personid="'+this.id+'">';
		l += this.getFullName();
		l += '</a>';
		return l;
	};

	// CONSTRUCTEUR
	if (data) {
		for (var key in data) {
			this[key] = data[key];
		}
		if (! this.name ) this.createName();
	}

	if (!this.id) this.id = game.people.length;

	game.people.push(this);
	this.residence.population.push(this);

}
