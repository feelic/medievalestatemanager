/*
 * Logs population info to the log
 */
Game.prototype.census = function () {
	for (var i = 0; i < this.people.length;i++) {
		if (this.people[i].alive) {
			game.time.log.alivePopulation++;
			game.time.log.ages.push(this.people[i].age);
		}
	}
};

Game.prototype.getAvgAgeOfDeath = function () {
	var t = 0;
	var a = 0;
	for (var i = 0; i < this.people.length;i++) {
		if (!this.people[i].alive) {
			t += this.people[i].age;
			a++;
		}
	}
	return (t/a);
};

/*
 * Logs demographic data to the console
 */
Game.prototype.logDemographicData = function () {
	console.group('Demographic data : '+game.time.current+' '+game.time.currentYear);
		console.log((game.time.currentYear - game.time.startYear)+' years since the game started');
		console.log('total population: '+game.time.log.alivePopulation);
		console.log('average age: '+average(game.time.log.ages));
		console.log('marriages: '+game.time.log.marriages);
		console.log('births: '+game.time.log.births);
		console.log('deaths: '+game.time.log.deaths);
		console.log('migrations: '+game.time.log.migrations);
		console.log('average age of death (all time): '+this.getAvgAgeOfDeath());
	console.groupEnd();
};
