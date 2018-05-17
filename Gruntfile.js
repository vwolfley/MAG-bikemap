module.exports = function (grunt) {

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),
        babel: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            dist: {
                files: {
                    "./dist/js/main.min.js": "./src/js/main.js"
                }
            }
        },
        postcss: {
            options: {
                map: true, // inline sourcemaps

                // or
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    annotation: 'dist/css/maps/' // ...to the specified directory
                },

                processors: [
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'src/css/*.css'
            }
        }
    });

    // grunt.registerTask("test", ["babel", "postcss"]);
    grunt.registerTask("test", ["postcss"]);
};