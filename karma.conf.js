// Karma configuration
// Generated on Fri Oct 13 2023 17:20:57 GMT+0200 (heure d’été d’Europe centrale)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'js/*.js',
            'spec/*Spec.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
        preprocessors: {},

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
        reporters: ['progress', 'spec'],

        specReporter: {
            maxLogLines: 5,             // limit number of lines logged per test
            suppressSummary: true,      // do not print summary
            suppressErrorSummary: true, // do not print error summary
            suppressFailed: false,      // do not print information about failed tests
            suppressPassed: false,      // do not print information about passed tests
            suppressSkipped: true,      // do not print information about skipped tests
            showBrowser: false,         // print the browser for each spec
            showSpecTiming: false,      // print the time elapsed for each spec
            failFast: true,             // test would finish with error when a first fail occurs
            prefixes: {
                success: '    OK: ',      // override prefix for passed tests, default is '✓ '
                failure: 'FAILED: ',      // override prefix for failed tests, default is '✗ '
                skipped: 'SKIPPED: '      // override prefix for skipped tests, default is '- '
            },
        },
        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
        browsers: ['Firefox'],

        plugins: [
            'karma-jasmine',
            'karma-firefox-launcher',
            'karma-spec-reporter'
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser instances should be started simultaneously
        concurrency: Infinity
    })
}
