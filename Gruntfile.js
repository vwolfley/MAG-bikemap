module.exports = function (grunt) {

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        options: {
            base: "app",
            dist: "//MAG1113/ArcGISVirtualRoot/maps/vw/employ/app",
        },

        bannercss: "/*! =============================================================\n" +
            " * MAG Employment Map Viewer\n" +
            " * Maricopa Association of Governments\n" +
            " * Style document for MAG Employment Map Viewer\n" +
            " * =============================================================\n" +
            " * @project 	MAG Employment Map Viewer\n" +
            " * @file		main.css\n" +
            " * @version 	<%= pkg.version %>\n" +
            " * @date 		<%= pkg.date %>\n" +
            " * @copyright	<%= pkg.copyright %> MAG\n" +
            " * @license 	MIT\n" +
            " * ===============================================================\n" +
            " */",

        htmlhint: {
            build: {
                options: {
                    "tag-pair": true, // Force tags to have a closing pair
                    "tagname-lowercase": true, // Force tags to be lowercase
                    "attr-lowercase": true, // Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    "attr-value-double-quotes": true, // Force attributes to have double quotes rather than single
                    // "doctype-first": true,           // Force the DOCTYPE declaration to come first in the document
                    "spec-char-escape": true, // Force special characters to be escaped
                    "id-unique": true, // Prevent using the same ID multiple times in a document
                    // "head-script-disabled": false,   // Prevent script tags being loaded in the head for performance reasons
                    "style-disabled": true // Prevent style tags. CSS should be loaded through
                },
                src: ["src/index.html", "src/app/views/*.html"]
            }
        },

        jshint: {
            files: ["src/config.js", "src/app/*.js", "src/app/config/*.js", "src/app/helpers/*.js", "src/app/models/*.js", "src/app/vm/*.js"],
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
                reporter: require("jshint-stylish-ex")
            }
        },

        uglify: {
            options: {
                // add banner to top of output file
                banner: '/*! main.js | <%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %> */\n'
            },
            build: {
                files: {
                    // config files
                    "../deploy/build.min/app/config/cbrConfig.js": ["app/config/cbrConfig.js"],
                    "../deploy/build.min/app/config/colorRampConfig.js": ["app/config/colorRampConfig.js"],
                }
            }
        },

        csslint: {
            options: {
                csslintrc: ".csslintrc",
                formatters: [{
                    id: require("csslint-stylish"),
                    dest: "reports/csslint_stylish.xml"
                }]
            },
            strict: {
                options: {
                    import: 2
                },
                src: ["src/app/resources/css/main.css"]
            },
            lax: {
                options: {
                    import: false
                },
                src: ["src/app/resources/css/main.css"]
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
                    cwd: "src/app/resources/css",
                    src: ["normalize.css", "main.css"],
                    dest: "dist/app/resources/css",
                    ext: ".min.css"
                }]
            }
        },

        concat: {
            options: {
                stripBanners: true,
                banner: "<%= bannercss %>\n"
            },
            dist: {
                src: ["dist/app/resources/css/normalize.css", "dist/app/resources/css/main.css"],
                dest: "dist/app/resources/css/concat.min.css"
            }
        },

        clean: {
            build: {
                src: ["dist/"]
            },
            cleancss: {
                src: ["dist/app/resources/css/*.css", "!dist/app/resources/css/concat.min.css"]
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

        watch: {
            html: {
                files: ["index.html"],
                tasks: ["htmlhint"]
            },
            css: {
                files: ["app/resources/css/main.css"],
                tasks: ["csslint"]
            },
            js: {
                files: ["app/main.js"],
                tasks: ["jshint"]
            }
        },

        versioncheck: {
            options: {
                skip: ["semver", "npm", "lodash"],
                hideUpToDate: false
            }
        },

        toggleComments: {
            customOptions: {
                options: {
                    removeCommands: true
                },
                files: {
                    "dist/index.html": "dist/index.html",
                    "dist/app/vm/cbr-vm.js": "dist/app/vm/cbr-vm.js",
                    "dist/app/vm/contact-vm.js": "dist/app/vm/contact-vm.js",
                    "dist/app/vm/customData-vm.js": "dist/app/vm/customData-vm.js",
                    "dist/app/vm/definitions-vm.js": "dist/app/vm/definitions-vm.js",
                    "dist/app/vm/help-vm.js": "dist/app/vm/help-vm.js",
                    "dist/app/vm/legend-vm.js": "dist/app/vm/legend-vm.js",
                    "dist/app/vm/markupTools-vm.js": "dist/app/vm/markupTools-vm.js",
                    "dist/app/vm/print-vm.js": "dist/app/vm/print-vm.js",
                    "dist/app/vm/reports-vm.js": "dist/app/vm/reports-vm.js",
                    "dist/app/vm/social-vm.js": "dist/app/vm/social-vm.js",
                }
            }
        },

        replace: {
            update_Meta: {
                // source files array
                src: ["src/index.html", "src/config.js", "src/humans.txt", "README.md", "src/app/resources/css/main.css"],
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
                    // config.js    this.copyright = "2018";
                    from: /(this.copyright = )+(")([0-9]{4})+(")/g,
                    to: 'this.copyright = "' + "<%= pkg.copyright %>" + '"'
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
                    from: /(### version )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "### version " + '<%= pkg.version %>',
                }, {
                    // README.md
                    from: /(`Updated: )[0-9]{4}-[0-9]{2}-[0-9]{2}/g,
                    to: "`Updated: " + '<%= pkg.date %>',
                }, {
                    // main.css
                    from: /(@version 	)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "@version 	" + "<%= pkg.version %>",
                }, {
                    // main.css
                    from: /(@copyright 	)[0-9]{4}/g,
                    to: "@copyright 	" + "<%= pkg.copyright %>",
                }, {
                    // main.css
                    from: /(main.css)( \| )(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "main.css | v" + "<%= pkg.version %>",
                }, {
                    // main.css
                    from: /( \| )(@copyright )[0-9]{4}/g,
                    to: " | @copyright " + "<%= pkg.copyright %>",
                }]
            }
        }


    });

    // this would be run by typing "grunt test" on the command line
    // grunt.registerTask("test", ["uglify", "cssmin", "concat"]);

    grunt.registerTask("check", ["versioncheck"]);

    grunt.registerTask("work", ["jshint"]);

    grunt.registerTask("workcss", ["csslint"]);

    grunt.registerTask("testcss", ["cssmin"]);

    grunt.registerTask("buildcss", ["cssmin", "concat"]);

    grunt.registerTask("update", ["replace"]);

    // grunt.registerTask("build", ["replace", "cssmin", "concat"]);
    grunt.registerTask("build", ["clean:build", "replace", "copy", "concat", "toggleComments"]);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};
