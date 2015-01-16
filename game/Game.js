function Game (startmode) {

	var that = this;
	this.dateStart = Date.now();
	this.plots = [];
	this.people = [];

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
		for (var i = 0; i < this.people.length; i++) this.people[i].age += 0.25;

		if ( this.engine.selectedCell ) document.getElementById("rightpanel").innerHTML = this.engine.selectedCell.ownerObject.displayDetails();
	}

	/*
	 * Cell events listeners
	 */
	this.bindCellEventsListeners = function () {
		for (var i = 0; i < this.engine.cells.length; i++) {
			this.engine.cells[i].on('select',function(){
				document.getElementById("rightpanel").innerHTML = this.ownerObject.displayDetails();
			});
			this.engine.cells[i].on('deselect',function(){
				//console.log('custom deselect event handler '+this.id);
			});
		}
	}

	this.generateRandomWorld = function (size, maxPopulation) {
		var that = this;
		this.engine.newRandomWorld(size,16, function(){
			that.bindCellEventsListeners();
			for (var i = 0; i < this.cells.length; i++) {

				this.cells[i].on('select',function(){
					document.getElementById("rightpanel").innerHTML = this.ownerObject.displayDetails();
				});
				this.cells[i].on('deselect',function(){
					//console.log('custom deselect event handler '+this.id);
				});

				var p = new Plot(this.cells[i]);

				p.addStartingPopulation(maxPopulation);

				that.plots.push(p);
			}
			that.renderMap();
		});
	}


	//default dev values 
	if (startmode == 'dev') {
		this.localisation = new Localisation('Brittany');
		that.player = new Player('human');

		that.time = new Seasons(0);

		document.write(that.getUiContainer(true));
			
		that.engine = new Ptolemy('canvas');

	}

	document.getElementById("nextTurn").addEventListener("click", function( event ) {
		that.nextTurn();
	}, false);

}
