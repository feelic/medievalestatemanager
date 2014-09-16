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
			this.mapcells.push(new MapCell(this, this.diagram.cells[i]));
		}
		
		if(callback) callback.call(this);
	}
	
	this.applyNoisetoAllTheEdges = function(strength) {
		for(var i = 0; i < this.diagram.edges.length;i++){
			var e = this.diagram.edges[i];
			e.path = getNoisedPath(e.va, e.vb, strength);
		}
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
		var x = Math.floor(getRandomInRange(0, width));
		var y = Math.floor(getRandomInRange(0, height));
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
	point.x = ( A.x + B.x ) / 2 + getRandomInRange(-n, n);
	point.y = ( A.y + B.y ) / 2 + getRandomInRange(-m, m);

	return point;
}
function getRandomInRange (min, max) {
	return Math.random() * (max - min) + min;
}