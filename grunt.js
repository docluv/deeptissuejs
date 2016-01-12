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
                'js/dev/deeptissue.js',
                'js/dev/deeptissue.move.js',
                'js/dev/deeptissue.swipejs',
                'js/dev/deeptissue.tap.js',
                'js/dev/deeptissue.rotate.js',
                'js/dev/deeptissue.scale.js',
                'js/dev/deeptissue.swipe.js'
                //,'js/dev/deeptissue-swipetoselect.js'
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
          src: ['js/dev/deeptissue.js',
                'js/dev/deeptissue.move.js',
                'js/dev/deeptissue.swipejs',
                'js/dev/deeptissue.tap.js',
                'js/dev/deeptissue.rotate.js',
                'js/dev/deeptissue.scale.js',
                'js/dev/deeptissue.swipe.js'
                //,'js/dev/deeptissue-swipetoselect.js'
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