Person.prototype.renderLink = function () {
  var l = '<a class="link person-link ';
  if (!this.alive) l += 'dead';
  l += '" data-personid="'+this.id+'">';
  l += this.getFullName();
  l += '</a>';
  return l;
};

Person.prototype.renderDetails = function () {
  var d = '<div>';
  d += '<p>'+this.renderLink()+' ('+Math.floor(this.age)+', '+this.sex+')</p>';

  d += '<p>lives in '+this.residence.renderLink()+'</p>';
  if (this.placeOfBirth) d += '<p>born in '+this.placeOfBirth.renderLink()+'</p>';

  if (!this.alive) d += '<p>'+this.causeOfDeath+'</p>';

  //parents
  if (this.parents.length == 2) {
    d += '<p>';
    if (this.sex == 'm') d+= 'son of ';
    else d += 'daughter of ';

    d += this.parents[0].renderLink()+' and '+this.parents[1].renderLink()+'</p>';
  }
  //spouse
  if (this.spouse) {
    d += '<p>married to '+this.spouse.renderLink()+'</p>';
  }

  // children
  d += '<table>';
  for(var i = 0; i < this.children.length; i++) {
    d += '<tr><td>'+this.children[i].id+'</td><td>'+this.children[i].renderLink()+'</td>';
    d += '<td>('+Math.floor(this.children[i].age)+')</td>';
    d += '<td>';
    if(this.children[i].spouse && this.children[i].spouse.alive) d += 'm';
    else if (this.children[i].spouse) d += 'w';
    d += '</td>';
    d += '</tr>';

  }

  d += '</table></div>';

  return d;
};
