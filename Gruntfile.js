module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ["upload"],
    compass: {
      dev: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'src',
          outputStyle: 'expanded'
        }
      },
      main: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'src',
          outputStyle: 'expanded'
        }
      }
    },
    cssmin: {
      main: {
        expand: true,
        cwd: 'src/',
        src: ['rqf.css', 'rqf-foi.css'],
        banner: '/*! = CSS built <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> = */',
        dest: 'upload/',
        ext: '.min.css'
      }
    },
    uglify: {
	    main: {
	    	options: {
	    		drop_console: true,
          banner: '/*! = JS built <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> = */'
	    	},
	      files: {
          'upload/rqf.min.js': ['src/rqf.js'],
          'upload/welcome-text.min.js': ['src/welcome-text.js']
	      }
	    }
	  },
    watch: {
      options: {
        livereload: true,
      },
      dev: {
        files: ['src/**/*'],
        tasks: 'compass:dev'
      },
    },
    connect: {
      dev: {
        options: {
          port: 1723,
          hostname: '*',
          base: 'src',
          livereload:true,
          open:true
        }
      }
    }
});

  // Load the plugins
  //Using load-grunt-tasks instead of having a loadNpmTasks line for each plugin
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  //Tasks
  grunt.registerTask('dev', [
    'compass:dev',
    'connect:dev',
    'watch:dev'
  ]);

  grunt.registerTask('build', [
    'clean',
    'compass:main',
    'cssmin',
    'uglify'
  ]);

};