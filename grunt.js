module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'js/debug/*.js']
    },
    jshint: {
      options: {
        browser: true
      }
    },
    concat: {
        dist: {
          src: ['js/debug/license.txt',
                'js/debug/deeptissue.js',
                'js/debug/deeptissue.move.js',
                'js/debug/deeptissue.swipejs',
                'js/debug/deeptissue.tap.js',
                'js/debug/deeptissue.rotate.js',
                'js/debug/deeptissue.scale.js',
                'js/debug/deeptissue.swipe.js'
                //,'js/debug/deeptissue-swipetoselect.js'
                ],
          dest: 'js/deep-tissue.js',
          separator: ';'
        },
        license: {
          src: ['js/debug/license.txt',
                'js/deep-tissue.min.js'
                ],
          dest:'js/deep-tissue.min.js',
          separator: ';'
        }

      },
      min: {
        dist: {
          src: ['js/debug/deeptissue.js',
                'js/debug/deeptissue.move.js',
                'js/debug/deeptissue.swipejs',
                'js/debug/deeptissue.tap.js',
                'js/debug/deeptissue.rotate.js',
                'js/debug/deeptissue.scale.js',
                'js/debug/deeptissue.swipe.js'
                //,'js/debug/deeptissue-swipetoselect.js'
                ],
          dest: 'js/deep-tissue.min.js'
        }
      }
  });

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
//  grunt.loadNpmTasks('grunt-sample');

  // Default task.
  grunt.registerTask('default', 'lint min concat');

};