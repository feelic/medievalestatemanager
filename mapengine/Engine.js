function Engine (canvasId) {

	this.mapcells = [];
	this.width = 800;
	this.height = 800;
	this.bbox = {xl:0, xr:this.width, yt:0, yb:this.height};
	this.diagram = null;
	this.margin = 0.1;

	this.canvas = document.getElementById(canvasId);

	/*
	 * Renders the map cells to an html element (with id = canvasId)
	 */
	this.render = function() {

		var ctx = this.canvas.getContext('2d');
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.rect(0,0,this.canvas.width,this.canvas.height);
		ctx.fillStyle = '#428A9E';
		ctx.fill();
		ctx.strokeStyle = '#000';
		ctx.stroke();
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
	 * re renders currently selected cell
	 */
	this.renderCellSelection = function (cellId) {
		//cancel previous selection
		if(this.selectedCell) {
			this.selectedCell.strokeColor = false;
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

		console.log({ y: top, x: left })
		return { y: top, x: left };
	}
}

//RANDOM 2D POINT SET
function random2DPointSet( width, height, min_dist, count ) {
	this.width = width;
	this.height = height;
	
	this.cellSize = min_dist/Math.sqrt(2);
	this.iw = Math.ceil(width/this.cellSize);
	this.ih = Math.ceil(height/this.cellSize);
	
	this.points = [];

	for (var i = 0;i < count;i++) {
		var x = getRandomIntegerInRange(0, width);
		var y = getRandomIntegerInRange(0, height);
		this.points.push({ x : x, y : y });
	}
}

//UTIL FUNCTIONS
function getNoisedPath (A, B, i) {
	var p = [A];
	var ps = getNoisedSegment (A, B,i/4);
	p = p.concat(ps);
	p.push(B);
	return p;
}

function getNoisedSegment (A, B, i) {
	var mid = getRandomPointBetween (A, B);
	if (i > 0) return getNoisedSegment(A, mid, Math.floor(i/2) ).concat(mid, getNoisedSegment(mid,B,Math.floor(i/2)) );
	else return [mid];
}

function getRandomPointBetween (A, B) {
	var point = {};
	
	n = Math.abs(A.x - B.x)/2;
	m = Math.abs(A.y - B.y)/2;
	point.x = Math.round(( A.x + B.x ) / 2 + getRandomIntegerInRange(-n, n));
	point.y = Math.round(( A.y + B.y ) / 2 + getRandomIntegerInRange(-m, m));

	return point;
}

function getRandomInRange (min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomIntegerInRange (min, max) {
    max+=1;
	return Math.floor(Math.random() * (max - min) + min);
}

function getRandomInArray(a) {
	return a[Math.floor(Math.random()*a.length)];
}

function addPoints( a, b ) {
	return { x: a.x + b.x, y : a.y + b.y }
}
function substractPoints( a, b ) {
	return { x: a.x - b.x, y : a.y - b.y }
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}
