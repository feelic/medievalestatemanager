function Game (startmode) {

	this.getUiContainer = function () {

		var c = '<div>'+this.time.getWeatherReport()+'';
		c += '<canvas id="voronoiCanvas" width="800" height="800"></canvas>';
		c += '</div>';
		return c;
	}

	//build from save


	//new game


	//default dev values 
	if (startmode == 'dev') {

		this.localisation = new Localisation('Brittany');
		this.player = new Player('human');
		this.region = new Region();
		this.time = new Seasons(0);

		document.write(this.getUiContainer());
				
		this.engine = new Engine();
		this.engine.newRandomWorld(1000,8, function(){
			console.log(this)
			this.render();
		});

	}
}
