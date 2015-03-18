function Demesne (colorPalette) {

	this.owner = null;
	this.lord = null;
	this.manor = null;
	this.plots = [];

	if (colorPalette) this.palette = colorPalette;
	else this.palette = game.getColorPalette();


	this.claimFreeLand = function (mode) {

		var visited = [];
		var tovisit = this.manor.getNeighbours();

		visited.push(this.manor.id);

		while( tovisit.length > 0) {
			var p = game.getPlotById(tovisit.shift());
			if (p.biome != 'mountains' && p.biome != 'sea' && p.type == 'inhabited') {
				this.plots.push(p);
				if (mode) p.type = mode;
				else p.type = getRandomInArray([ "tenure","tenure","tenure","tenure","servile land","servile land","servile land","servile land","city" ]);
				p.demesne = this;
				break;
			}
			else if (p.demesne == this) {
				visited.push(p.id);
				var n = p.getNeighbours();
				for (var i = 0; i < n.length; i++) {
					if (tovisit.indexOf(n[i]) !== -1 || visited.indexOf(n[i]) !== -1) tovisit.push(n[i]);
				}
			}
		}

	};

}
