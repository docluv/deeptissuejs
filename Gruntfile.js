module.exports = function (grunt) {

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
                //     'js/debug/deeptissue.swipejs',
                'js/debug/deeptissue.tap.js',
                'js/debug/deeptissue.rotate.js',
                'js/debug/deeptissue.scale.js'
                //,'js/debug/deeptissue.swipe.js'
                //,'js/debug/deeptissue-swipetoselect.js'
                ],
                dest: 'js/deep-tissue.js',
                separator: ';'
            },
            license: {
                src: ['js/debug/license.txt',
                'js/deep-tissue.min.js'
                ],
                dest: 'js/deep-tissue.min.js',
                separator: ';'
            }

        },
        uglify: {
        //    options: {
        //        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        //'<%= grunt.template.today("yyyy-mm-dd") %> */'
        //    },

            dist: {
                src: ['js/debug/deeptissue.js',
                'js/debug/deeptissue.move.js',
                'js/debug/deeptissue.swipejs',
                'js/debug/deeptissue.tap.js',
                'js/debug/deeptissue.rotate.js',
                'js/debug/deeptissue.scale.js'
                //,'js/debug/deeptissue.swipe.js'
                //,'js/debug/deeptissue-swipetoselect.js'
                ],
                dest: 'js/deep-tissue.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify']);

};