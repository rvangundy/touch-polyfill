module.exports = function (grunt) {
    'use strict';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                './scripts/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        },
        jsdoc : {
            dist : {
                src: ['./scripts/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        connect: {
            test: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        },
        browserify: {
            test: {
                src  : ['test/test.js'],
                dest : '.tmp/index.js',
                options : {
                    debug : true
                }
            }
        },
        bump: {
            options: {
                files              : ['package.json'],
                updateConfigs      : [],
                commit             : true,
                commitMessage      : 'Release v%VERSION%',
                commitFiles        : ['-a'],
                createTag          : true,
                tagName            : 'v%VERSION%',
                tagMessage         : 'Version %VERSION%',
                push               : true,
                pushTo             : 'git://github.com/rvangundy/generator-basic.git',
                gitDescribeOptions : '--tags --always --abbrev=1 --dirty=-d'
            }
        },
        open : {
            test : {
                path: 'http://localhost:8000/test',
                app: 'Google Chrome'
            }
        },
        watch: {
            scripts: {
                files: ['src/*.*', 'test/*.*'],
                tasks: ['browserify:test']
            }
        }
    });

    grunt.registerTask('test', [
        'browserify',
        'connect:test',
        'open:test',
        'watch'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'browserify'
    ]);

    grunt.registerTask('release', [
        'jshint',
        'bump'
    ]);
};
