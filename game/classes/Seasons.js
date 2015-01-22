function Seasons (i, year, history) {
	
	this.startYear = year;
	this.currentYear = year;

	this.seasonCounter = i;
	this.seasonNames = ['Spring', 'Summer', 'Fall', 'Winter'];

	this.weather = { "humidity" : 0, "rainfall" : 0, "temperature" : 0 };

	this.current = this.seasonNames[i%4];

	if (history) this.history = history;
	else this.history = [];

	this.nextSeason = function () {
		this.seasonCounter++;

		if (this.seasonCounter%4 == 0) this.currentYear++;

		this.current = this.seasonNames[this.seasonCounter%4];


		this.history.push(this.log);
		this.log = this.getBlankLog();
	};

	this.getSeasonName = function (i) {
		return this.seasonNames[i%4];
	};

	this.getWeatherReport = function () {
		var w = '<div>'+this.current+' '+this.currentYear+'</div>';
		w += '<div>humidity : '+this.weather.humidity+'</div>';
		w += '<div>rainfall : '+this.weather.rainfall+'</div>';
		w += '<div>temperature : '+this.weather.temperature+'</div>';
		return w;
	};

	this.getBlankLog = function () {
		return {
			deaths : 0,
			agesOfDeath : [],
			births : 0,
			marriages : 0,
			ages : [],
			alivePopulation : 0,
		};
	};

	this.log = this.getBlankLog();
}
