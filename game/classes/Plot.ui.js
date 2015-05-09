Plot.prototype.renderLink = function () {
  var l = '<a class="link plot-link" data-plotid="'+this.id+'">';
  l += this.getName();
  l += '</a>';
  return l;
}

Plot.prototype.renderDetails = function () {
	var d = '<div>';
	d += '<p>id: '+this.id+' ('+this.biome+')</p>';
	if (this.name) d += '<p>name: '+this.name+'</p>';
	if (this.demesne) d += '<p>part of the ' + this.demesne.renderLink() + ' estate</p>';
	d += '<p>height: '+this.height+'</p>';
	d += '<p>area: '+this.surface+' ha</p>';
	d += '<p>population: ' + this.getPop() + ' (' + this.getPopDensityBracket() + ' density)</p>';
	d += '<p>forestation: ' + this.forestation + ' %</p>';
	d += '<p>soil quality: ' + this.soilQuality + ' %</p>';
	d += '</div>';
	d += '<div>';
	d += this.renderPopList();
	d += '</div>';
	return d;
}

Plot.prototype.renderPopList = function (){
	var p = '<table>';
	for (var i = 0; i < this.population.length; i++) {
		p += '<tr>';
		p += '<td>'+this.population[i].renderLink()+'</td>';
		p += '<td>('+Math.floor(this.population[i].age)+')</td>';
		p += '<td>';
		if(this.population[i].spouse && this.population[i].spouse.alive) p += 'm';
		else if (this.population[i].spouse) p += 'w';
		p += '</td>';
		p += '</tr>';

	}

	p += '</table>';

	return p;
}
