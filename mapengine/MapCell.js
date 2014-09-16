function MapCell(engine, cell) {
	this.engine = engine;
	this.cell = cell;
	this.path = [];

	/*
	 * Trace le polygone
	 *
	 */
	this.render = function () {

		var ctx = this.engine.canvas.getContext('2d');

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.moveTo(this.path[0].x,this.path[0].y);
		for (var i = 1; i < this.path.length; i++) {
			ctx.lineTo(this.path[i].x,this.path[i].y);
		}
		//ctx.stroke();
		ctx.closePath();
		ctx.fill();
		
		ctx.textAlign = "center";
		//ctx.fillStyle = '#f00';
		
		//ctx.fillRect(this.cell.site.x,this.cell.site.y,1,1);
		//ctx.fillText(this.height,this.cell.site.x-2/3,this.cell.site.y-2/3);
		
	}

	/*
	 * Récupère le path à partir de la cellule voronoi
	 *
	 */
	this.definePath = function () {
		this.overZero();
		//this.logHEdges();
		var edges = [];
		if (this.cell) {
			for (var i = 0; i < this.cell.halfedges.length; i++) {
				edges.push(this.cell.halfedges[i].edge);
			}

			this.path.push(edges[0].va);
			var i = 0;
			while ( edges.length > 0) {
				//dernier point inséré
				var a = this.path[this.path.length-1];
				//segment à traiter
				var v = edges[i%edges.length];
				var va = edges[i%edges.length].va;
				var vb = edges[i%edges.length].vb;
				//console.log(Math.floor(va.x)+':'+Math.floor(va.y)+' '+Math.floor(vb.x)+':'+Math.floor(vb.y));
				var msg = '';
				//on ignore l'ordre dans lequel est écrit le segment, il ne faut pas ajouter deux fois le mm point
				if ( (a.x == va.x) && (a.y == va.y) ) {
					edges.splice(edges.indexOf(v), 1);
					this.path = this.path.concat(v.path);
					i = 0;
					msg = 'a == vb ('+Math.floor(10*a.x)/10+':'+Math.floor(10*a.y)/10+')';
				}
				else if ( (a.x == vb.x) && (a.y == vb.y) ) {
					edges.splice(edges.indexOf(v), 1);
					for(var j = (v.path.length-1);j>=0;j--) {
						this.path.push(v.path[j]);
					}
					i = 0;
					msg = 'a == va ('+Math.floor(10*a.x)/10+':'+Math.floor(10*a.y)/10+')';
				}
				else {
					msg = '... ('+Math.floor(10*a.x)/10+':'+Math.floor(10*a.y)/10+')';
					i++;
				}
				//console.log(i+' : '+edges.length+' '+Math.floor(10*va.x)/10+':'+Math.floor(10*va.y)/10+' - '+Math.floor(10*vb.x)/10+':'+Math.floor(10*vb.y)/10+' '+msg)
				if( i >= 50 ) break;

			}
		}
		else {
			console.log('what');
			console.log(this.id)
		}

		//this.logPath();
	}
	
	/*
	 * Détermine le type de province
	 *
	 */
	this.defineType = function () {
		if (this.height <= 0) {
			this.type = "sea";
		}
		else if (this.height == 3) {
			this.type = "hills";
		}
		else if (this.height == 4) {
			this.type = "mountains";
		}
		else {
			this.type= "plains";
		}
		
		this.getRenderParameters();
	}
	/*
	 * Récupère le path à partir de la cellule voronoi
	 *
	 */
	this.logHEdges = function () {
		for (var i = 0; i < this.cell.halfedges.length; i++) {
			var plog = "";

			plog += Math.floor(this.cell.halfedges[i].edge.va.x)+':'
			plog += Math.floor(this.cell.halfedges[i].edge.va.y)+' - '
			plog += Math.floor(this.cell.halfedges[i].edge.vb.x)+':'
			plog += Math.floor(this.cell.halfedges[i].edge.vb.y)+''
			console.log(plog);
		}
	}
	/*
	 * Récupère le path à partir de la cellule voronoi
	 *
	 */
	this.logPath = function () {
		for (var i = 0; i < this.path.length; i++) {
			var plog = "";

			plog += Math.floor(this.path[i].x)+':'
			plog += Math.floor(this.path[i].y);
			console.log(plog);
		}
	}

	/*
	 * Renvoie true si le poly se trouve sur les bords du canevas, false sinon
	 *
	 */
	this.isScreenBorders = function () {
		//console.log(this.cell.halfedges.length)
		for (var i = 0; i < this.cell.halfedges.length; i++) {
			var e = this.cell.halfedges[i].edge;

			if (e.va.x <= 0 || e.va.x >= this.engine.width || e.va.y <= 0 || e.va.y >= this.engine.height || e.vb.x <= 0 || e.vb.x >= this.engine.width || e.vb.y <= 0 || e.vb.y >= this.engine.height) {

			return true;

			}
		}

		return false;
	}

	/*
	 * Attribue des données random
	 *
	 */
	this.randomize = function () {
		if(this.isScreenBorders()) this.height = -1
		else this.height = Math.floor(getRandomInRange(-1, 5));
	}
	
	/*
	 * Attribue les paramètres de rendu
	 *
	 */
	this.getRenderParameters = function () {
		if(this.type=="sea") this.color = '#428A9E';
		if(this.type=="plains") this.color = '#6BC66E';
		if(this.type=="hills") this.color = '#98A641';
		if(this.type=="mountains") this.color = '#80762A';
	}


	/*
	 * s'assure que tous les points sont > 0
	 *
	 */
	this.overZero = function () {
		if (this.cell) {
			for (var i = 0; i < this.cell.halfedges.length; i++) {
				if(this.cell.halfedges[i].edge.va.x<0) this.cell.halfedges[i].edge.va.x = 0;
				if(this.cell.halfedges[i].edge.va.y<0) this.cell.halfedges[i].edge.va.y = 0;
				if(this.cell.halfedges[i].edge.vb.x<0) this.cell.halfedges[i].edge.vb.x = 0;
				if(this.cell.halfedges[i].edge.vb.y<0) this.cell.halfedges[i].edge.vb.y = 0;
			}
		}
		else {
			console.log('what');
						console.log(this.id)
		}
	}

	this.definePath();
	this.randomize();
	this.defineType();

}
