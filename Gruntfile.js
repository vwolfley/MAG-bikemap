module.exports = function(grunt){

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),
        banner: '/*!\n' +
                        '*@concat.min.css\n' +
                        '*@CSS Document for Land Use Website @ MAG\n' +
                        '*@For Production\n' +
                        '*@<%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %>\n' +
                        '*@author <%= pkg.author %>\n' +
                    '*/\n',

        htmlhint: {
            build: {
                options: {
                    "tag-pair": true,                    // Force tags to have a closing pair
                    "tagname-lowercase": true,           // Force tags to be lowercase
                    "tag-self-close": true,             // The empty tag must closed by self
                    "attr-lowercase": true,             // Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    "attr-value-double-quotes": true,   // Force attributes to have double quotes rather than single
                    "attr-value-not-empty": true,       // Attribute must set value
                    "doctype-first": true,              // Force the DOCTYPE declaration to come first in the document
                    "spec-char-escape": true,           // Force special characters to be escaped
                    "id-unique": true,                   // Prevent using the same ID multiple times in a document
                    // "head-script-disabled": false,    // Prevent script tags being loaded in the head for performance reasons
                    "style-disabled": true,              // Prevent style tags. CSS should be loaded through
                    "src-not-empty": true,                // src of img(script,link) must set value
                    "img-alt-require": true,             // Alt of img tag must be set value
                    "csslint": true,                    // Scan css with csslint
                    "jshint": true,                    // Scan script with jshint
                    "force": false                    // Report HTMLHint errors but don't fail the task
                },
                src: ["index.html"]
            }
        },

        // CSSLint. Tests CSS code quality
        // https://github.com/gruntjs/grunt-contrib-csslint
        csslint: {
            // define the files to lint
            files: ["css/main.css"],
                strict: {
                    options: {
                        "import": 0,
                        "empty-rules": 0,
                        "display-property-grouping": 0,
                        "shorthand": 0,
                        "font-sizes": 0,
                        "zero-units": 0,
                        "important": 0,
                        "duplicate-properties": 0,
                    }
            }
        },

        jshint: {
            files: ["js/config.js", "js/main.js"],
                options: {
                    // strict: true,
                    sub: true,
                    quotmark: "double",
                    trailing: true,
                    curly: true,
                    eqeqeq: true,
                    unused: true,
                    scripturl: true,    // This option defines globals exposed by the Dojo Toolkit.
                    dojo: true,        // This option defines globals exposed by the jQuery JavaScript library.
                    jquery: true,     // Set force to true to report JSHint errors but not fail the task.
                    force: true,
                    reporter: require("jshint-stylish-ex")
                }
        },

        uglify: {
            options: {
                // add banner to top of output file
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %> */\n',
                // mangle: false,
                // compress: true,
            },
            build: {
                files: {
                    "js/main.min.js": ["js/main.js"],
                }
            }
        },

        cssmin: {
            add_banner: {
                options: {
                // add banner to top of output file
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %> */\n'
                },
                files: {
                    "css/main.min.css": ["css/main.css"],
                    "css/normalize.min.css": ["css/normalize.css"],
                    "css/bootstrapmap.min.css": ["css/bootstrapmap.css"]
                }
            }
        },

        concat: {
            options: {
              stripBanners: true,
              banner: '<%= banner %>'
            },
            dist: {
              src: ["css/normalize.min.css", "css/bootstrapmap.min.css", "css/main.min.css"],
              dest: 'app/resources/css/concat.min.css'
            }
        },

        watch: {
          scripts: {
            files: ["js/main.js", "js/config.js"],
            tasks: ["jshint"],
            options: {
              spawn: false,
              interrupt: true,
            },
          },
        },

    });

    // this would be run by typing "grunt test" on the command line
    grunt.registerTask("work", ["jshint"]);

    grunt.registerTask("buildcss", ["cssmin", "concat"]);
    grunt.registerTask("buildjs", ["uglify"]);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/

