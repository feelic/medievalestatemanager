function Localisation (loc) {
	
	var that = this;

	this.loc = loc;

	// DEFAULT LOCALISATION IS FRANCE
	this.mnames = [
		"Adélard","Adrien", "Ansèlme", "Arnaut", "Arthur", "Aurèle", "Adhémar",
		"Barthelemy", "Bartholomé", "Baudoin", "Bérenger", "Bertrand", "Bernard","Benoît",
		"Clément", "Clotaire", "Clovis", "Colin",  "Dominique",
		"Enguerrand", "Eudes", "Etienne", "Flavien", "Florentin", "Foulque",
		"Gaël", "Gaëtan", "Gaspard", "Gaultier", "Gauvin", "Guillaume", "Guethenoc", "Guildin",
		"Hugues", "Isidore","Jean", "Jacques",
		"Maurin", "Michel", "Perceval", "Pierrick", "Paul", "Pierre",
		"Raoul", "Robin", "Roland", "Roger", "Renaud", "Ranulfe","Robert",
		"Tancrède", "Théobald", "Thimotée", "Thomas"
	];

	this.fnames = [
		"Agathe", "Aliénor", "Alix", "Anatasie", "Ariane", "Aude", "Aure", "Aurore", 
		"Blanche", "Brunehaut", 
		"Camille", "Catherine", "Clémence", "Clothilde", "Colombe", "Constance", "Cunégonde", "Cyrielle", 
		"Eléonore", "Emma", "Ermeline", "Eulalie", 
		"Flore", "Genièvre","Gisèle", "Hildegarde", "Geneviève", "Iseult", 
		"Jeanne", "Jehanne", "Justine", "Mahaut", "Margaux", "Marguerite", "Mathilde","Marie"
	];

	this.gen = 'de';
	this.st = 'Saint';

	this.placesnames = [
		"Beaulieu", "Bréant", "Grillères", "Vaux", "Sange", "Millier", "Morlan"
	];

	//PLace names, fr_HonHon
	/*
	this.placesnames = [
		"Croissant", "Omelette", "Fromage", "Saucisson", "Paris", "Amour", "Cigarette", "Moustache", "Pamplemousse", "Poulette", "Bonjour", "Lafayette"
	];


	*/
/*
	// LOAD LOCALISATION FILES 
	$.getJSON( "localisation/"+this.loc+"/names/male_firstnames.json", function( data ) {
	  that.mnames = data.names;
	});
	$.getJSON( "localisation/"+this.loc+"/names/female_firstnames.json", function( data ) {
	  that.fnames = data.names;
	});
	/*$.getJSON( "localisation/"+this.loc+"/names/city_names.json", function( data ) {
	  that.citynames = data.citynames;
	});*/


	this.getRandomName = function (t) {
		switch (t) {
			case 'm' :
				return this.mnames[Math.floor(Math.random()*this.mnames.length)];
			case 'f' :
				return this.fnames[Math.floor(Math.random()*this.fnames.length)];
			case 'place' :
				if (this.placesnames.length > 0) {
					var n = this.placesnames[Math.floor(Math.random()*this.placesnames.length)];
					this.placesnames.splice(this.placesnames.indexOf(n),1);
					return n;
				} 
				else {
					return this.st+' '+this.mnames[Math.floor(Math.random()*this.mnames.length)];
				}
			default :
				break;
		}
	};
}
