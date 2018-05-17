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
                    "./src/js/main.min.js": "./src/js/main.js"
                }
            }
        }
    });

    grunt.registerTask("test", ["babel"]);
};