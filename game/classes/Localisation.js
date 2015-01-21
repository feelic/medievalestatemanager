function Localisation (locale) {
	
	var that = this;

	this.locale = locale;

	this.localisations = {
		"France": {
			m : [
				"Adélard","Adrien", "Ansèlme", "Arnaut", "Arthur", "Aurèle", "Adhémar",
				"Barthelemy", "Bartholomé", "Baudoin", "Bérenger", "Bertrand", "Bernard","Benoît",
				"Clément", "Clotaire", "Clovis", "Colin",  "Dominique",
				"Enguerrand", "Eudes", "Etienne", "Flavien", "Florentin", "Foulque",
				"Gaël", "Gaëtan", "Gaspard", "Gaultier", "Gauvin", "Guillaume", "Guethenoc", "Guildin",
				"Hugues", "Isidore","Jean", "Jacques",
				"Maurin", "Michel", "Perceval", "Pierrick", "Paul", "Pierre",
				"Raoul", "Robin", "Roland", "Roger", "Renaud", "Ranulfe","Robert",
				"Tancrède", "Théobald", "Thimotée", "Thomas"
			],
			f : [
				"Agathe", "Aliénor", "Alix", "Anatasie", "Ariane", "Aude", "Aure", "Aurore", 
				"Blanche", "Brunehaut", 
				"Camille", "Catherine", "Clémence", "Clothilde", "Colombe", "Constance", "Cunégonde", "Cyrielle", 
				"Eléonore", "Emma", "Ermeline", "Eulalie", 
				"Flore", "Genièvre","Gisèle", "Hildegarde", "Geneviève", "Iseult", 
				"Jeanne", "Jehanne", "Justine", "Mahaut", "Margaux", "Marguerite", "Mathilde","Marie"
			],
			genC : 'de ',
			genV : 'd\'',
			townsWithSaintNames : 0.15,
			mSt : 'Saint',
			fSt : 'Sainte',
			places : [
				"Beaulieu", "Bréant", 
				"Chaumont", "Colonnet",
				"Dimon", 
				"Eminnes",
				"Faix", "Fougnons",
				"Grillères", 
				"Haguemur",
				"Jannois", 'Junières',
				"Lilouet", 'Lambier',
		 		"Millier", "Morlan",
				"Nanderolles", "Nerleux",
				"Ponleu", "Palagu",
				"Rengain", "Reuteaux",
				"Sange", "Serlandes",
				"Tolence",
				"Vaux",
			]
		}
	};

	if (!this.localisations[this.locale]) throw new Error('Unknown locale "'+this.locale+'", did you forget to load it or something ?');
	//PLace names, fr_HonHon
	/*
	this.placesnames = [
		"Croissant", "Omelette", "Fromage", "Saucisson", "Paris", "Amour", "Cigarette", "Moustache", "Pamplemousse", "Poulette", "Bonjour", "Lafayette"
	];
	*/


	this.getRandomName = function (t) {
		return this.localisations[this.locale][t][Math.floor(Math.random()*this.localisations[this.locale][t].length)];
	};

	this.getRandomPlaceName = function () {
		if (this.localisations[this.locale].places.length > 0) {
			if(randomBoolFromRate(0.85)) {
				var n = this.localisations[this.locale].places[Math.floor(Math.random()*this.localisations[this.locale].places.length)];
				this.localisations[this.locale].places.splice(this.localisations[this.locale].places.indexOf(n),1);
				return n;
			}
			else return this.getRandomSaintName();
		} 
		else {
			return this.getRandomSaintName();
		}
	};

	this.getRandomSaintName = function () {
		//let's not use the same name for a saint twice, it exists in real life, but would be more confusing than anything in game
		if (!this.existingSaints) this.existingSaints = {'f': [], 'm' : []};

		var g = '';
		if(randomBoolFromRate(0.5)) g = 'm';
		else g = 'f';

		var n = this.getRandomName(g);
		if (this.existingSaints[g].length <  this.localisations[this.locale][g].length) {
			while(this.existingSaints[g].indexOf(n) != -1 ) {
				n = this.getRandomName(g);
			}
		}
		this.existingSaints[g].push(n);
		return this.localisations[this.locale][g+'St']+' '+n;
	};

	this.getGen = function (name) {
		var g = this.localisations[this.locale].genC;

		if (isVowel(name[0])) g = this.localisations[this.locale].genV;
		return g;

	};
}
