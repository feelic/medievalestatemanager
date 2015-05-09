	/*
	 * gets Game Container
	 */
  Game.prototype.getUiContainer = function (debug) {

		var c = '<div id="leftmenu">';

		// Map mode buttons
		c += '<div>';
		c += '<a id="geoMode" class="btn btn-action">G</a> ';
		c += '<a id="demographicMode" class="btn btn-action">D</a> ';
		c += '<a id="politicalMode" class="btn btn-action">P</a> ';
		c += '</div>';
		// Weather box & next turn button
		c += '<div id="weatherbox">'+this.time.getWeatherReport()+'</div><div><a id="nextTurn" class="btn">next turn</a></div>';

		if (debug) c += '<div style="float:left;" id="enginestatus"></div>';
		c += '</div>';
		c += '<div id="mappanel"><div id="canvas" ></div></div>';
		c += '<div id="rightpanel"></div>';
		return c;
	};
