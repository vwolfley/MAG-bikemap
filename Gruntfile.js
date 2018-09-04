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
                src: ["dist/"]
            },
            cleanjs: {
                src: ["dist/js/*.js", "!dist/js/main.js"]
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
        },
        replace: {
            update_Meta: {
                src: ["src/index.html", "src/views/about.html", "src/humans.txt", "README.md"], // source files array
                // src: ["README.md"], // source files array
                overwrite: true, // overwrite matched source files
                replacements: [{
                    // html pages
                    from: /(<meta name="revision-date" content=")[0-9]{4}-[0-9]{2}-[0-9]{2}(">)/g,
                    to: '<meta name="revision-date" content="' + '<%= pkg.date %>' + '">',
                }, {
                    // html pages
                    from: /(<meta name="version" content=")([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))(">)/g,
                    to: '<meta name="version" content="' + '<%= pkg.version %>' + '">',
                }, {
                    // config.js
                    from: /(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( \| )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: 'v' + '<%= pkg.version %>' + ' | ' + '<%= pkg.date %>',
                }, {
                    // humans.txt
                    from: /(Version\: )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "Version: " + '<%= pkg.version %>',
                }, {
                    // humans.txt
                    from: /(Last updated\: )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "Last updated: " + '<%= pkg.date %>',
                }, {
                    // README.md
                    from: /(### version \| )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "### version | " + '<%= pkg.version %>',
                }, {
                    // README.md
                    from: /(\* #### Updated \| )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "* #### Updated | " + '<%= pkg.date %>',
                }]
            }
        }
    });

    grunt.registerTask("build", ["clean:build", "replace", "copy", "clean:cleanjs", "concat", "toggleComments", "babel", "uglify", "postcss"]);
};
