function Game (startmode) {

	var that = this;

	this.plots = [];

	/*
	 * gets Game Container
	 */
	this.getUiContainer = function (debug) {

		var c = '<div id="leftmenu"><div id="weatherbox">'+this.time.getWeatherReport()+'</div><div><a id="nextTurn" class="btn">next turn</a></div>';
		if (debug) c += '<div style="float:left;" id="enginestatus"></div>';
		c += '</div>';
		c += '<div id="mappanel"><div id="canvas" ></div></div>';
		c += '<div id="rightpanel"></div>';
		return c;
	};

	/*
	 * tells the plots to render, they then do their stuff themselves
	 */
	this.renderMap = function () {
		this.engine.render();
	};

	/*
	 * Goes to the next turn
	 */
	this.nextTurn = function () {
		this.time.nextSeason();
		document.getElementById("weatherbox").innerHTML = this.time.getWeatherReport();
		for (var i = 0; i < this.plots.length; i++ ) this.plots[i].seasonChange();
	}

	//build from save


	//new game


	//default dev values 
	if (startmode == 'dev') {
		//this.localisation = new Localisation('Brittany');
		this.player = new Player('human');

		this.time = new Seasons(0);

		document.write(this.getUiContainer(true));
				
		this.engine = new Ptolemy('canvas');
		this.engine.newRandomWorld(200,16, function(){
			for (var i = 0; i < this.cells.length; i++) {
				this.cells[i].on('select',function(){
					document.getElementById("rightpanel").innerHTML = this.ownerObject.displayDetails();
				});
				this.cells[i].on('deselect',function(){
					//console.log('custom deselect event handler '+this.id);
				});
				that.plots.push(new Plot(this.cells[i], that));
			}
			that.renderMap();
		});

	}

	document.getElementById("nextTurn").addEventListener("click", function( event ) {
		that.nextTurn();
	}, false);
}
