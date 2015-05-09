function Game (startmode) {

	var that = this;

	this.dateStart = Date.now();
	this.demesnes = [];
	this.plots = [];
	this.landPlots = [];
	this.people = [];

	this.displayMode = 'geo';

	/*
	 * tells the plots to render, they then do their stuff themselves
	 */
	this.renderMap = function () {
		this.engine.render();
	};

	this.changeDisplayMode = function (mode) {
		console.log(mode+' mapmode');
		this.displayMode = mode;
		this.renderMap();
	};

	/*
	 * Goes to the next turn
	 */
	this.nextTurn = function () {
		this.time.nextSeason();
		this.census();
		document.getElementById("weatherbox").innerHTML = this.time.getWeatherReport();
		for (var i = 0; i < this.plots.length; i++ ) {

			this.plots[i].seasonChange();
		}

		this.renderMap();
	}

	/*
	 * Auto passes turns (years*4)
	 */
	this.fastForward = function(years) {
		console.time('Fast forwarding game '+years+' years');
		for(var i = 0; i < years*4; i++) {
			this.nextTurn();
		}
		console.timeEnd('Fast forwarding game '+years+' years');

		this.renderMap();
	};

	/*
	 * Cell events listeners
	 */
	this.bindCellEventsListeners = function () {
		for (var i = 0; i < this.engine.cells.length; i++) {
			this.engine.cells[i].on('select',function(){
				document.getElementById("rightpanel").innerHTML = this.ownerObject.renderDetails();
			});
			this.engine.cells[i].on('deselect',function(){
				//console.log('custom deselect event handler '+this.id);
			});
		}
	}

	this.getPlotById = function (id) {
		for (var i = 0; i < this.plots.length; i++) {
			if (this.plots[i].id == id) {
				return this.plots[i];
			}
		}
		throw new Error('Couldn\'t find plot with id '+id);
	}
	this.getPersonById = function (id) {
		for (var i = 0; i < this.people.length; i++) {
			if (this.people[i].id == id) {
				return this.people[i];
			}
		}
	}
	this.getDemesneById = function (id) {
		for (var i = 0; i < this.demesnes.length; i++) {
			if (this.demesnes[i].id == id) {
				return this.demesnes[i];
			}
		}
	}

	this.generateRandomWorld = function (size, maxPopulation) {
		var that = this;
		this.engine.newRandomWorld(size,16, function(){
			that.bindCellEventsListeners();
			for (var i = 0; i < this.cells.length; i++) {

				this.cells[i].on('select',function(){
					document.getElementById("rightpanel").innerHTML = this.ownerObject.renderDetails();
				});
				this.cells[i].on('deselect',function(){
					//console.log('custom deselect event handler '+this.id);
				});

				var p = new Plot(this.cells[i]);
				p.type = 'inhabited';

				that.plots.push(p);
				if (p.height > 0) that.landPlots.push(p);
			}
			that.generateRandomSociety(size, maxPopulation);
			that.renderMap();
		});
	}

	this.generateRandomSociety = function (size, population) {

		// generate manors to rule over the peasants
		for (var i = 0; i < size/80; i++) {
			var demesne = new Demesne (i);
			this.demesnes.push(demesne);

			var plot = getRandomInArray(this.landPlots);
			plot.type = 'manor';
			plot.name = game.localisation.getRandomPlaceName();

			demesne.manor = plot;
			demesne.plots.push(plot);
			plot.demesne = demesne;
		}

		// generate the lords & share the land between holdings
		for (var i = 0; i < this.demesnes.length; i++) {
			var d = this.demesnes[i];
			var age = 12 + Math.ceil(Math.random()*20);
			var lord = new Person({ 'birthDate' : age * -4, 'birthYear' : game.time.startYear - age, 'age' : age, 'sex' : 'm', 'residence' : d.manor, 'status' : 'nobility'});
			age = 12 + Math.ceil(Math.random()*20);
			var lady = new Person({ 'birthDate' : age * -4, 'birthYear' : game.time.startYear - age, 'age' : age, 'sex' : 'f', 'residence' : d.manor, 'status' : 'nobility'});

			d.lord = lord;

			var demesneSize = 2+ Math.floor(Math.random()*4);
			for (var j = 0; j < demesneSize; j++) {
				d.claimFreeLand();
			}
		}

		for (var i = 0; i < this.landPlots.length; i++) {
			var p = this.landPlots[i];
			p.addStartingPopulation(population);
		}

	}

	//default dev values
	if (startmode == 'dev') {
		this.localisation = new Localisation('France');
		that.player = new Player('human');

		that.time = new Seasons(0, 963);

		document.write(that.getUiContainer(true));

		that.engine = new Ptolemy('canvas');

	}

	document.getElementById("nextTurn").addEventListener("click", function( event ) {
		that.nextTurn();
	}, false);

	document.getElementById("geoMode").addEventListener("click", function( event ) {
		that.changeDisplayMode('geo');
	}, false);

	document.getElementById("politicalMode").addEventListener("click", function( event ) {
		that.changeDisplayMode('political');
	}, false);

	document.getElementById("demographicMode").addEventListener("click", function( event ) {
		that.changeDisplayMode('demographic');
	}, false);

	$(document).on('click', '.link', function() {
		var p;
		if($(this).hasClass('person-link')) {
			p = that.getPersonById($(this).attr('data-personid'));
		}
		else if ($(this).hasClass('plot-link')) {
			p = that.getPlotById($(this).attr('data-plotid'));
		}
		else if ($(this).hasClass('demesne-link')) {
			p = that.getDemesneById($(this).attr('data-demesneid'));
		}
		$('#rightpanel').html(p.renderDetails());
	});
}
Game.version = '1.0';
Game.toString = function () {
	return 'Medieval Estate Manager 2015 v '+this.version;
};
