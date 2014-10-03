function Engine (canvasId) {

	var that = this;

	this.mapcells = [];
	this.width = 800;
	this.height = 800;
	this.bbox = {xl:0, xr:this.width, yt:0, yb:this.height};
	this.diagram = null;
	this.margin = 0.1;

	this.canvas = document.getElementById(canvasId);
	this.scaleFactor = 1;
	this.zoomLevel = 1;
	this.pan = {x : 0, y : 0};
	this.origin = { x : 0, y : 0 };

	/*
	 * Renders the map cells to an html element (with id = canvasId)
	 */
	this.render = function() {

		var ctx = this.canvas.getContext('2d');
		ctx.clearRect(0,0,this.width,this.height);

		ctx.rect(0,0,this.width,this.height);
		ctx.fillStyle = '#428A9E';
		ctx.fill();

		ctx.translate(this.pan.x,this.pan.y);
		ctx.scale(this.scaleFactor,this.scaleFactor);

		for (var i = 0; i < this.mapcells.length; i++) {
			this.mapcells[i].render();
		}
	}
	
	/*
	 * Generates the corresponding voronoi diagram for a new random set of points, then applies noise to the borders and fools around with heights
	 */
	this.newRandomWorld = function(cellCount, edgeNoise, callback) {
	
		this.grid = new random2DPointSet(this.width, this.height, 100, cellCount);
			
		var voronoi = new Voronoi()
		voronoi.recycle(this.diagram);
		this.diagram = voronoi.compute(this.grid.points, this.bbox);
	
		this.applyNoisetoAllTheEdges(edgeNoise);
		
		for (var i = 0; i < this.grid.points.length; i++) {
			if(this.diagram.cells[i]) this.mapcells.push(new MapCell(this, this.diagram.cells[i]));
		}

		this.randomizeHeights (Math.ceil(cellCount/500),Math.ceil(cellCount/100));

		if(callback) callback.call(this);
	}
	
	/*
	 * Gets a random noised path for each border between cells
	 */
	this.applyNoisetoAllTheEdges = function(strength) {
		for(var i = 0; i < this.diagram.edges.length;i++){
			var e = this.diagram.edges[i];
			e.path = getNoisedPath(e.va, e.vb, strength);
		}
	}

	/*
	 * Uses a drunkard walk to set random heights on the map, then defines the height of all remaining cells
	 */
	this.randomizeHeights = function (chains, chainLength) {
		//Screen border are always water
		for (var i = 0; i < this.mapcells.length; i++) {
			if (this.mapcells[i].isScreenBorders()) {
				this.mapcells[i].height = -1;
			}
		}
		
		//create a number of mountain ranges
		for(var i = 0; i < chains; i++)	{
			var h = 4;
			var cell = this.mapcells[Math.floor(Math.random()*this.mapcells.length)];
			for(var j = 0; j < chainLength; j++) {

				if (!cell.height && cell.height != 0) {

					cell.height = h;
					var n = cell.getNeighbours();
					cell = this.mapcells[n[Math.floor(Math.random()*n.length)]];
					//console.log(cell);
				}
				else {
					if (i>=0 && j<=0) i--;
					break;
				}
			}
		}
		//a little bit more randomness, shall we?
		for (var i = 0; i < this.mapcells.length/100; i++) {
			var a = Math.floor(Math.random()*this.mapcells.length);
			this.mapcells[a].height = getRandomInArray([-1,0,1,2,3]);
		}

		//sets heights according to neighbours to some random cells
		for (var i = 0; i < this.mapcells.length/4; i++) {
			var a = Math.floor(Math.random()*this.mapcells.length);
			if (!this.mapcells[a].height && this.mapcells[a].height != 0) {
				var h = this.getAvgHeightFromCellList(this.mapcells[a].getNeighbours()) + getRandomInArray([-1,0,0,0,0,1]);
				if (h < -2) h = -2;
				if (h > 5) h = 5;
				this.mapcells[a].height = h;
			}
		}

		//sets the remaining cells heights
		for (var i = 0; i < this.mapcells.length; i++) {
			if (!this.mapcells[i].height && this.mapcells[i].height != 0) {
				var h = this.getAvgHeightFromCellList(this.mapcells[i].getNeighbours()) + getRandomInArray([-1,0,0,0,0,1]);
				if (h < -2) h = -2;
				if (h > 5) h = 5;
				this.mapcells[i].height = h;
			}
			//getRandomIntegerInRange(-1,1);
		}
		//Screen border are ALWAYS water
		for (var i = 0; i < this.mapcells.length; i++) {
			if (this.mapcells[i].isScreenBorders()) {
				this.mapcells[i].height = -1;
			}
		}
	}
	
	/*
	 * Gets the average height from an array of cell ids
	 */
	this.getAvgHeightFromCellList = function (idList){
		a = 0;
		t = 0;
		for (var i = 0; i < idList.length; i++) {
			if(this.mapcells[idList[i]].height || this.mapcells[idList[i]].height == 0){
				a += this.mapcells[idList[i]].height;
				t++;
			}
		}
		return Math.round(a/t);
	}
	
	/*
	 * Cell selector
	 */
	this.selectCellAtPoint = function (point) {

		var m = substractPoints(point, this.getCanvasOffset());
		// Adjust point with current zoom
		m.x = m.x/this.zoomLevel;
		m.y = m.y/this.zoomLevel;

		// Adjust point with current origin
		m.x = m.x - this.origin.x/this.zoomLevel;
		m.y = m.y - this.origin.y/this.zoomLevel;

		var c = this.getCellFromPoint(m);
		//console.log(c)
		if (c != -1) {
			this.renderCellSelection(c);
		}
	}

	/*
	 * returns the id of the cell containing the point parameter
	 */
	this.getCellFromPoint = function (point) {
		for (var i = 0; i < this.mapcells.length; i++) {
			if (isPointInPoly(this.mapcells[i].path, point)) return this.mapcells[i].id;
		}
		console.log('Not a cell');
		return -1;
	}

	/*
	 * re-renders currently selected cell
	 */
	this.renderCellSelection = function (cellId) {
		//cancel previous selection
		if(this.selectedCell) {
			this.selectedCell.strokeColor = false;
			var n = this.selectedCell.getNeighbours();
			for(var i = 0; i < n.length;i++) this.mapcells[n[i]].render();
			this.selectedCell.render();
		}
		//adds border
		this.selectedCell = this.mapcells[cellId];
		this.selectedCell.strokeColor = 'red';
		this.selectedCell.render();
	}

	/*
	 * gets canvas offset on the page for coordinate ajustment
	 */
	this.getCanvasOffset = function() {
		var element = this.canvas
		var top = 0, left = 0;
		do {
			top += element.offsetTop  || 0;
			left += element.offsetLeft || 0;
			element = element.offsetParent;
		} while(element);

		return { y: top, x: left };
	}

	/*
	 * Zooms In
	 */
	this.zoomIn = function () {
		if (this.zoomLevel < 2) { 
			// Puts the origin back to 1:1 scale
			this.origin.x = this.origin.x * (1 / this.zoomLevel);
			this.origin.y = this.origin.y * (1 / this.zoomLevel);

			// set scale and zoom
			this.scaleFactor = 1.5; 
			this.zoomLevel += 0.5;

			// set pan to 0 and ajust origin to zoom level
			this.pan = { x:0, y:0 }
			this.origin.x = this.origin.x * this.zoomLevel;
			this.origin.y = this.origin.y * this.zoomLevel;

			console.log('zoom in '+this.zoomLevel+' factor '+this.scaleFactor)
			this.render();
		}
	}

	/*
	 * Zooms Out
	 */
	this.zoomOut = function () {
		if (this.zoomLevel > 1) {
			// Puts the origin back to 1:1 scale
			this.origin.x = this.origin.x * (1 / this.zoomLevel);
			this.origin.y = this.origin.y * (1 / this.zoomLevel);

			// set scale and zoom
			this.scaleFactor = 1 / 1.5; 
			this.zoomLevel -= 0.5;

			// set pan to 0 and ajust origin to zoom level
			this.pan = { x:0, y:0 }
			this.origin.x = this.origin.x / this.zoomLevel;
			this.origin.y = this.origin.y / this.zoomLevel;

			console.log('zoom out '+this.zoomLevel+' factor '+this.scaleFactor )
			this.render();
		}
	}

	/*
	 * Pan to coordinates
	 */
	this.panToCoordinates = function (x, y) {

		this.scaleFactor = 1;

		this.pan.x = x;
		this.pan.y = y;

		this.render();
	}

	/*
	 * Pan canvas according to vertex a b
	 */
	this.panWithVertex = function (a,b) {

		// AJUST VERTEX EITHER HERE
		var x = ((b.x - a.x) / this.zoomLevel);
		var y = ((b.y - a.y) / this.zoomLevel);

		// OR THERE
		this.origin.x += x;
		this.origin.y += y;

		this.panToCoordinates(x, y);
	}

	// CANVAS EVENT HANDLER
	var mousePosition;

	this.canvas.addEventListener("mousedown", function(e){
		mousePosition = getMouse(e || event);
	}, false);

	this.canvas.addEventListener("mouseup", function(e){
		var point = getMouse(e || event);
		if(segmentLength(point,mousePosition)>10){
			that.panWithVertex(mousePosition, point);
		}
		else {
			var a = that.selectCellAtPoint(point);
		}
	}, false);


	this.canvas.addEventListener('DOMMouseScroll', function(e){
		var delta = 0;
	 
		if (!e) e = window.event;
	 
		// normalize the delta
		if (e.wheelDelta) {
		    // IE and Opera
		    delta = e.wheelDelta / 60;
		} else if (e.detail) {
		    // W3C
		    delta = -e.detail / 2;
		}
	 	if(delta>0) {
			that.zoomIn();
		}
		else {
			that.zoomOut();
		}

	}, false);
}
