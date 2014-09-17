function Localisation (loc) {
	
	var that = this;

	this.loc = loc;

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
				break;
			case 'f' :
				return this.fnames[Math.floor(Math.random()*this.fnames.length)];
				break;
			case 'city' :
				return this.citynames[Math.floor(Math.random()*this.citynames.length)];
				break;
			default :
				break;
		}
	
	}
}
