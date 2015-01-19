function Seasons (i, year) {
	
	this.startYear = year;
	this.currentYear = year;

	this.seasonCounter = i;
	this.seasonNames = ['Spring', 'Summer', 'Fall', 'Winter'];

	this.weather = { "humidity" : 0, "rainfall" : 0, "temperature" : 0 };

	this.current = this.seasonNames[i%4];

	this.nextSeason = function () {
		this.seasonCounter++;

		if (this.seasonCounter%4 == 0) this.currentYear++;

		this.current = this.seasonNames[this.seasonCounter%4];
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
}
