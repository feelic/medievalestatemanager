function Engine () {

	this.mapcells = [];
	this.width = 800;
	this.height = 800;
	this.bbox = {xl:0, xr:this.width, yt:0, yb:this.height};
	this.diagram = null;
	this.margin = 0.1;
	
	this.render = function(){
		this.canvas = document.getElementById('voronoiCanvas');
		
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
	
	this.applyNoisetoAllTheEdges = function(strength) {
		for(var i = 0; i < this.diagram.edges.length;i++){
			var e = this.diagram.edges[i];
			e.path = getNoisedPath(e.va, e.vb, strength);
		}
	}

	this.randomizeHeights = function (chains, chainLength) {
		//Les bordures de l'écran sont forcément de l'eau
		for (var i = 0; i < this.mapcells.length; i++) {

			if (this.mapcells[i].isScreenBorders()) {
				this.mapcells[i].height = -1;
			}
		}
		
		//ON créée des chaines prédéterminées
		for(var i = 0; i < chains; i++)	{
			//console.log('chain ' +i)

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

		//On fait les calculs de moyenne pour toutes les autres cellules
		
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
	point.x = ( A.x + B.x ) / 2 + getRandomIntegerInRange(-n, n);
	point.y = ( A.y + B.y ) / 2 + getRandomIntegerInRange(-m, m);

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