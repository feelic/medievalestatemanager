function Game (startmode) {

	var that = this;

	this.plots = [];

	/*
	 * gets Game Container
	 */
	this.getUiContainer = function () {

		var c = '<div id="leftmenu"><div>'+this.time.getWeatherReport()+'</div><div><a id="nextTurn">next turn</a></div></div>';
		c += '<div id="mappanel"><canvas id="voronoiCanvas" width="800px" height="800px"></canvas></div>';
		c += '<div id="rightpanel"></div>';
		return c;
	}

	/*
	 * tells the plots to render, they then do their stuff themselves
	 */
	this.renderMap = function () {
		this.engine.render();
	}

	//build from save


	//new game


	//default dev values 
	if (startmode == 'dev') {

		//this.localisation = new Localisation('Brittany');
		this.player = new Player('human');

		this.time = new Seasons(0);

		document.write(this.getUiContainer());
				
		this.engine = new Engine('voronoiCanvas');
		this.engine.newRandomWorld(200,16, function(){
			for (var i = 0; i < this.mapcells.length; i++) {
				that.plots.push(new Plot(this.mapcells[i]));
			}
			that.renderMap();
		});

	}
}
