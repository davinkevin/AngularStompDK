module.exports = function (config) {
    config.set({
        frameworks: ['jspm', 'jasmine', 'jasmine-matchers'],

        files: [
            '../node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js'
        ],

        preprocessors: {
            'app/**/!(*.spec).js': ['babel', 'coverage']
        },

        babelPreprocessor: { options: { stage: 0, sourceMap: 'inline' } },

        basePath: 'public',

        jspm: {
            config: 'config.js',
            loadFiles: ['app/angular-stomp.js', '**/*.spec.js'],
            serveFiles: ['**/*.+(js|html|css)'],
            stripExtension: true
        },

        proxies: {
            '/app/': '/base/app/',
            '/jspm_packages/': '/base/jspm_packages/'
        },

        reporters: ['dots', 'coverage'],

        coverageReporter: {
            instrumenters: { isparta : require('isparta') },
            instrumenter: { 'app/**/*.js': 'isparta' },
            dir: '../reports/coverage/',
            reporters: [
                {type: 'html'}, {type: 'json'}, {type: 'lcov'}, {type: 'text-summary'}
            ]
        },

        /*logLevel: config.,*/
        browsers: ['PhantomJS'],
        singleRun : false,
        browserNoActivityTimeout: 75000
    });
};