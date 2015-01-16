function Localisation (loc) {
	
	var that = this;

	this.loc = loc;

	// DEFAULT LOCALISATION IS FRANCE
	this.mnames = [
		"Adélard","Adrien", "Ansèlme", "Arnaut", "Arthur", "Aurèle", "Adhémar",
		"Barthelemy", "Bartholomé", "Baudoin", "Bérenger", "Bertrand", "Bernard","Benoît",
		"Clément", "Clotaire", "Clovis", "Colin",  "Dominique",
		"Enguerrand", "Eudes", "Etienne",
		"Flavien", "Florentin", "Foulque",
		"Gaël", "Gaëtan", "Gaspard", "Gaultier", "Gauvin", "Guillaume", "Guethenoc", "Guildin",
		"Hugues",
		"Isidore","Jean", "Jacques",
		"Maurin", "Michel",
		"Perceval", "Pierrick", "Paul", "Pierre",
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
			case 'city' :
				return this.citynames[Math.floor(Math.random()*this.citynames.length)];
			default :
				break;
		}
	};
}
