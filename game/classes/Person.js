function Person (data) {
	this.name = null;
	this.lastname = null;

	this.birthDate = null; //Saison de naissance
	this.birthYear = null; //Année de naissance
	this.age = 0;
	this.sex = 'm';
	this.health = 100;
	this.alive = true;

	this.job = null;
	this.residence = null;

	this.craft = null;
	this.level = null;
	this.levels = ["apprentice", "journeyman", "master"];

	this.parents = [];
	this.spouse = null;
	this.children = [];
	this.pregnant = false;

	/*
	 * Returns false or a New Child entity
	 */
	this.haveChild = function () {
		if ((this.spouse) && (this.spouse.alive) && this.sex == 'f' && this.age >= 16 && this.age <= 36 && ( this.children.length == 0 || this.children[this.children.length-1].age > 1 ) && this.children.length < 16 && !this.pregnant) {
			var chances = 0.90 * (( 36 - this.age ) / 20);
			if (randomBoolFromRate(chances)) {

				var alive = true;
				// probability of stillbirth
				if(randomBoolFromRate(0.25)) alive = false;

				// We need to determine the social status of the child
				var status = 'serf';
				
				var s = ['m','f'];
				var p = new Person({
						'birthDate' : game.time.seasonCounter,
						'birthYear' : game.time.currentYear,
						'sex' : s[Math.round(Math.random())],
						'status' : status,
						'residence' : this.residence,
						'alive' : alive,
						'health' : 72
					});

				this.children.push(p);
				this.spouse.children.push(p);
				p.setParents(this, this.spouse);

				//probability of the mother dying in labour
				if (this.health < 25 && randomBoolFromRate(1/4)) this.alive = false;
				else if (this.health < 75 && randomBoolFromRate(1/6)) this.alive = false;
				else if (randomBoolFromRate(1/8)) this.alive = false;

				if ( this.alive == false ) console.log(this.getFullName()+' died in labour');
				if (p.alive == false) console.log(p.getFullName()+' was dead at birth');
				return p;
				
			}
			else return false;
		}
		else return false;
	};

	/*
	 * Check if the person dies or not :(
	 */
	this.mortality = function () {
		this.age += 0.25;

		if (!randomBoolFromRate((100+this.health)/200)) this.alive = false;
		if (!this.alive) console.log(this.getFullName()+' died aged '+this.age+' (health : '+this.health+')');

		if (this.age < 25) this.health = cap(this.health + 4, 100, 0);
		else if (this.age < 30) this.health = cap(this.health + 2, 100, 0);
		else if (this.age < 40) this.health = cap(this.health + 0, 100, 0);
		else if (this.age < 45) this.health = cap(this.health - 0.5, 100, 0);
		else if (this.age < 50) this.health = cap(this.health - 1, 100, 0);
		else this.health = cap(this.health - 1.5, 100, 0);
	}

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
		if (this.status == 'nobility') this.lastname = game.localisation.gen +' '+ this.residence.name;

		if (this.parents && this.parents.length > 0) {
			this.lastname = this.parents[1].lastname;
		}

		if (! this.name ) this.name = game.localisation.getRandomName(this.sex);
	}

	this.getFullName = function () {
		if(this.lastname) return this.name+' '+this.lastname;
		else return this.name;
	}

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
