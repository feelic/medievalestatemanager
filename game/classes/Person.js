function Person (data) {

	this.name;
	this.lastname;

	this.birthDate; //Saison de naissance
	this.age = 0;
	this.sex;
	this.health;
	this.alive = true;

	this.status;
	this.job;
	this.residence;

	this.craft;
	this.level;
	this.levels = ["apprentice", "journeyman", "master"];

	this.parents = [];
	this.spouse;
	this.children = [];
	this.pregnant = false;

	// CONSTRUCTEUR
	if (data) {
		for (key in data) {
			this[key] = data[key];
		}
	}

	/*
	 * Returns false or a New Child entity
	 */
	this.haveChild = function () {
		if ((this.spouse) && (this.spouse.alive) && this.sex == 'f' && this.age >= 16 && this.age <= 36 && ( this.children.length = 0 || this.children[this.children.length-1].age > 1 ) && !this.pregnant) {
			var chances = 0.90 * (( 36 - this.age ) / 20);
			if (randomBoolFromRate(chances)) {
				var child = new Person();
				this.children.push(child);
				this.spouse.children.push(child);
				child.setParents(this, this.spouse);

				return child;
			}
			else return false;
		}
		else return false;
	}

	/*
	 *	Sets Parents
	 */
	this.setParents = function (parentA, parentB) {
		this.parents = [];
		this.parents.push(parentA);
		this.parents.push(parentB);
	}

	this.setResidence = function (r) {
		//this.residence.pop()
	}
}
