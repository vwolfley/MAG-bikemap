/* ========================================================================
 * MAG Bikeways
 * Maricopa Association of Governments
 * @file Gruntfile.js
 * @summary Grunt file for task automation for MAG Bikeways Viewer
 * @version 3.2.0
 * http://ims.azmag.gov/
 * ========================================================================
 * @copyright 2017 MAG
 * @license MIT
 * ========================================================================
 */
module.exports = function(grunt) {

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

            bannercss: "/*! =============================================================\n" +
            " * MAG Bikeways\n" +
            " * Maricopa Association of Governments\n" +
            " * Style document for MAG Bikeways\n" +
            " * =============================================================\n" +
            " * @project    MAG Bikeways\n" +
            " * @file       concat.min.css\n" +
            " * @version    <%= pkg.version %>\n" +
            " * @date       <%= pkg.date %>\n" +
            " * @copyright  <%= pkg.copyright %> MAG\n" +
            " * @license    MIT\n" +
            " * ===============================================================\n" +
            " */",

            bannerjs: "/*! =============================================================\n" +
            " * MAG Bikeways\n" +
            " * Maricopa Association of Governments\n" +
            " * JavaScript document for MAG Bikeways\n" +
            " * =============================================================\n" +
            " * @project    MAG Bikeways\n" +
            " * @file       main-concat.min.js\n" +
            " * @version    <%= pkg.version %>\n" +
            " * @date       <%= pkg.date %>\n" +
            " * @copyright  <%= pkg.copyright %> MAG\n" +
            " * @license    MIT\n" +
            " * ===============================================================\n" +
            " */",

        jshint: {
            files: ["Gruntfile.js", "src/js/config.js", "src/js/main.js", "src/js/plugins.js"],
            options: {
                // strict: true,
                sub: true,
                quotmark: "double",
                trailing: true,
                curly: true,
                eqeqeq: true,
                unused: true,
                scripturl: true, // This option defines globals exposed by the Dojo Toolkit.
                dojo: true, // This option defines globals exposed by the jQuery JavaScript library.
                jquery: true, // Set force to true to report JSHint errors but not fail the task.
                force: true,
                reporter: require("jshint-stylish")
            }
        },

        uglify: {
            options: {
                // add banner to top of output file
                banner: "/*! <%= pkg.name %> - @version <%= pkg.version %> | <%= pkg.date %> */\n",
                preserveComments: "false",
                mangle: false,
                // compress: true,
            },
            build: {
                files: {
                    "dist/js/main.min.js": ["dist/js/main.js"],
                    "dist/js/config.min.js": ["dist/js/config.js"],
                    "dist/js/plugins.min.js": ["dist/js/plugins.js"]
                }
            }
        },

        cssmin: {
            options: {
                specialComments: "all",
                processImport: false,
                roundingPrecision: -1,
                mergeIntoShorthands: false,
                advanced: false,
            },
            target: {
                files: [{
                    expand: true,
                    cwd: "dist/css",
                    src: ["normalize.css", "addtohomescreen.css", "main.css"],
                    dest: "dist/css",
                    ext: ".min.css"
                }]
            }
        },

        concat: {
            css: {
                options: {
                    stripBanners: true,
                    banner: "<%= bannercss %>"
                },
                src: ["dist/css/normalize.min.css", "dist/css/addtohomescreen.min.css", "dist/css/main.min.css"],
                dest: "dist/css/concat.min.css",
                nonull: true,
            },
            js: {
                options: {
                    stripBanners: true,
                    banner: "<%= bannerjs %>"
                },
                src: ["dist/js/plugins.min.js", "dist/js/config.min.js", "dist/js/main.min.js"],
                dest: "dist/js/main-concat.min.js",
                nonull: true,
            }
        },

        clean: {
            build: {
                src: ["dist/"]
            },
            cleancss: {
                src: ["dist/css/*.css", "!dist/css/concat.min.css"]
            },
            cleanjs: {
                src: ["dist/js/*.js", "!dist/js/main-concat.min.js"]
            },
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

        toggleComments: {
            customOptions: {
                options: {
                    removeCommands: false
                },
                files: {
                    "dist/index.html": "src/index.html",
                    "dist/js/main.js": "src/js/main.js"
                }
            }
        },

        replace: {
            update_Meta: {
                src: ["src/index.html", "src/humans.txt", "README.md", "src/css/main.css", "src/js/config.js", "src/js/main.js", "src/js/plugins.js"],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    // html pages
                    from: /(<meta name="revision-date" content=")[0-9]{4}-[0-9]{2}-[0-9]{2}(">)/g,
                    to: '<meta name="revision-date" content="' + "<%= pkg.date %>" + '">',
                }, {
                    // html pages
                    from: /(<meta name="version" content=")([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))(">)/g,
                    to: '<meta name="version" content="' + "<%= pkg.version %>" + '">',
                }, {
                    // humans.txt
                    from: /(Version\: )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "Version: " + "<%= pkg.version %>",
                }, {
                    // humans.txt
                    from: /(Last updated\: )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "Last updated: " + "<%= pkg.date %>",
                }, {
                    // README.md
                    from: /(version)( \| )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "version | " + "<%= pkg.version %>",
                }, {
                    // README.md
                    from: /(Updated)( \| )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "Updated | " + "<%= pkg.date %>",
                }, {
                    // config.js
                    from: /(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( \| )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "v" + "<%= pkg.version %>" + " | " + "<%= pkg.date %>",
                }]
            }
        }

    });

    // this would be run by typing "grunt test" on the command line
    grunt.registerTask("work", ["jshint"]);

    grunt.registerTask("buildcss", ["cssmin", "concat"]);
    grunt.registerTask("buildjs", ["uglify", "concat"]);
    grunt.registerTask("update", ["replace"]);

    grunt.registerTask("build", ["clean:build", "replace", "copy", "toggleComments", "cssmin", "uglify", "concat", "clean:cleancss", "clean:cleanjs"]);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/
