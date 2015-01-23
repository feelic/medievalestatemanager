/***************************** DISEASES ********************************/
Game.prototype.diseases = {
	"Flux" : {
		"activeEpidemy" : false, 
		"transmissionFactor" : 0.3,
		"stages" : [-5],
		"baseCureChance" : 0.4
	},
	"Leprosy" : {
		"activeEpidemy" : false, 
		"transmissionFactor" : 0.1,
		"stages" : [-10, -5],
		"baseCureChance" : 0.1
	},
	"Yellow Fever" : {
		"activeEpidemy" : false, 
		"transmissionFactor" : 0.2,
		"stages" : [-10],
		"baseCureChance" : 0.3
	},
	"Bloody Flux" : {
		"activeEpidemy" : false, 
		"transmissionFactor" : 0.2,
		"stages" : [-15],
		"baseCureChance" : 0.3
	},
	"Plague" : {
		"activeEpidemy" : false, 
		"transmissionFactor" : 0.5,
		"stages" : [-20],
		"baseCureChance" : 0.2
	},
};

/***************************** PLOT DATA ********************************/
Game.prototype.biomes = [ "sea","forest", "moors", "plains", "coast", "hills", "arid" ];
Game.prototype.plotTypes = [ "manor", "city", "tenure", "servile land", "inhabited" ];
Game.prototype.exploitationTypes = ["agriculture", "herding", "foresting", "quarry", "mining"] ;

/***************************** CRAFTS ********************************/
Game.prototype.crafts = ["Builder"]
Game.prototype.craftLevels = ["apprentice", "journeyman", "master"];

/***************************** COLOR PALETTES ********************************/
Game.prototype.nextPalette = 0;
Game.prototype.colorPalettes = [
	{
		"primary" : "#66ACCC",
		"secondary" : "#CCEFFF",
		"complementary" : "#406B7F"
	},
	{
		"primary" : "#DC4760",
		"secondary" : "#E28D9B",
		"complementary" : "#5C1E28"
	},
	{
		"primary" : "#4FE248",
		"secondary" : "#8CDC88",
		"complementary" : "#3B5C39"
	}
];
Game.prototype.getColorPalette = function () {
	var p = this.colorPalettes[this.nextPalette%this.colorPalettes.length];
	this.nextPalette++;
	return p;
};
