function Game (startmode) {

	var that = this;

	this.plots = [];

	/*
	 * gets Game Container
	 */
	this.getUiContainer = function () {

		var c = '<div>'+this.time.getWeatherReport()+'';
		c += '<canvas id="voronoiCanvas" width="800" height="800"></canvas>';
		c += '<div><a id="nextTurn">next turn</a></div></div>';
		return c;
	}

	/*
	 * tells the plots to render, they then do their stuff themselves
	 */
	this.renderMap = function () {
		for (var i = 0; i < this.plots.length; i++) this.plots[i].render();
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
		this.engine.newRandomWorld(1000,8, function(){
			for (var i = 0; i < this.mapcells.length; i++) {
				that.plots.push(new Plot(this.mapcells[i]));
			}
			that.renderMap();
		});

	document.onclick = function(e){
		function getMouse(e){
		    var w = window, b = document.body;
		    return {x: e.clientX + (w.scrollX || b.scrollLeft || b.parentNode.scrollLeft || 0),
		    y: e.clientY + (w.scrollY || b.scrollTop || b.parentNode.scrollTop || 0)};
		}
		var m = getMouse(e || event);
		console.log('click : '+m.x+' - '+m.y);
		var point = { 
			x: m.x,
 			y: m.y
		}

		var a = that.engine.selectCellAtPoint(point);

	}

	}
}
