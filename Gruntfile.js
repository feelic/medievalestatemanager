module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['game/Game.js','game/classes/*.js','game/lib/*.js']
    },
	csslint: {
		lax: {
			options: {
				import: false,
				'adjoining-classes' : false
			},
			src: ['src/css/*.css']
		}
	}
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');

  grunt.registerTask('default', ['jshint','csslint']);

};
