module.exports = function (config) {
    config.set({
        frameworks: ['jspm', 'jasmine', 'jasmine-matchers'],

        files: [
            'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js'
        ],

        preprocessors: {
            'core/**/!(*.spec).js': ['babel', 'coverage']
        },

        babelPreprocessor: { options: { stage: 0, sourceMap: 'inline' } },

        /*basePath: 'core',*/

        jspm: {
            config: 'config.js',
            loadFiles: ['core/**/*.spec.js'],
            serveFiles: ['core/**/*.+(js|html|css)'],
            stripExtension: true
        },

        proxies: {
            '/core/' : '/base/core/',
            '/jspm_packages/': '/base/jspm_packages/'
        },

        reporters: ['dots', 'coverage'],

        coverageReporter: {
            instrumenters: { isparta : require('isparta') },
            instrumenter: { 'core/**/*.js': 'isparta' },
            dir: 'reports/coverage/',
            subdir: normalizationBrowserName,
            reporters: [
                {type: 'html'}, {type: 'json'}, {type: 'lcov'}, {type: 'text-summary'}
            ]
        },

        /*logLevel: config.LOG_DEBUG,*/
        browsers: ['PhantomJS'],
        singleRun : false,
        browserNoActivityTimeout: 75000
    });

    function normalizationBrowserName(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
    }
};