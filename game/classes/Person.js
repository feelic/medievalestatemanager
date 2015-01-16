function Person (data) {

	this.name = null;
	this.lastname = null;

	this.birthDate = null; //Saison de naissance
	this.age = 0;
	this.sex = 'm';
	this.health = null;
	this.alive = true;

	this.status = 'dead';
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
				
				var s = ['m','f'];
				var p = new Person({
						'id' : game.people.length,
						'birthDate' : game.time.seasonCounter,
						'age' : 0,
						'sex' : s[Math.round(Math.random())],
						'health' : 100,
						'alive' : true,
						'status' : 'OK',
						'residence' : this.residence
					});
				game.people.push(p);
				this.residence.population.push(p);

				this.children.push(p);
				this.spouse.children.push(p);
				p.setParents(this, this.spouse);

				return p;
				
			}
			else return false;
		}
		else return false;
	};

	/*
	 *	Sets Parents
	 */
	this.setParents = function (parentA, parentB) {
		this.parents = [];
		this.parents.push(parentA);
		this.parents.push(parentB);
	};

	this.setResidence = function (r) {
		//this.residence.pop()
	};

	this.createName = function () {
		if (this.parents && this.parents.length > 0) {
			this.lastname = this.parents[1].lastname;
		}
		this.name = game.localisation.getRandomName(this.sex);
	}

	// CONSTRUCTEUR
	if (data) {
		for (var key in data) {
			this[key] = data[key];
		}
		if (! this.name ) this.createName();
	}
}
