Demesne.prototype.renderLink = function () {
  var l = '<a class="link demesne-link" data-demesneid="' + this.id + '">';
  l += this.lord.lastname;
  l += '</a>';
  return l;
}

Demesne.prototype.renderDetails = function () {
  var d = '<div>';
  d += '<p>'+this.lord.lastname+' Estate</p>';
  d += '<p>size: '+this.plots.length+'</p>';
  d += '<p>lord: '+this.lord.renderLink()+'</p>';

  d += '</div>';
  return d;
}
