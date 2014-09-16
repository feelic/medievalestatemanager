function Seasons (i) {
	
	this.seasonCounter = i;
	this.seasonNames = ['Spring', 'Summer', 'Fall', 'Winter'];

	this.weather = { "humidity" : 0, "rainfall" : 0, "temperature" : 0 };

	this.current = this.seasonNames[i%4];

	this.nextSeason = function () {
		this.seasonCounter++;
		this.current = this.seasonNames[this.seasonCounter%4];
	}

	this.getSeasonName = function (i) {
		return this.seasonNames[i%4];
	}

	this.getWeatherReport = function () {
		var w = '<div id="weatherbox"><div>'+this.current+'</div>';
		w += '<div>humidity : '+this.weather.humidity+'</div>';
		w += '<div>rainfall : '+this.weather.rainfall+'</div>';
		w += '<div>temperature : '+this.weather.temperature+'</div>';
		w += '</div>';
		return w;
	}
}
