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
                    "./dist/js/main.js": "./dist/js/main.js"
                }
            }
        },
        copy: {
            build: {
                cwd: "src/",
                src: ["**"],
                dest: "dist/",
                expand: true,
                dot: true
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            build: {
                files: {
                    "dist/js/main.js": ["dist/js/main.js"],
                }
            }
        },
        clean: {
            build: {
                src: ["dist/js"]
            }
        },
        concat: {
            dist: {
                src: ["src/js/*"],
                dest: "dist/js/main.js"
            }
        },
        postcss: {
            options: {
                map: true,
                map: {
                    inline: false,
                    annotation: 'dist/css/maps/'
                },
                processors: [
                    require('postcss-cssnext')(),
                    require('cssnano')()
                ]
            },
            dist: {
                files: {
                    'dist/css/main.css': 'src/css/main.css'
                }
            }
        },
        toggleComments: {
            customOptions: {
                options: {
                    removeCommands: false
                },
                files: {
                    "dist/index.html": "dist/index.html"
                }
            }
        }
    });

    grunt.registerTask("build", ["copy", "clean", "concat", "toggleComments", "babel", "uglify", "postcss"]);
};
