module.exports = function (karmaConfig) {
	'use strict';

	karmaConfig.set({
		basePath: '../',
    	frameworks: ['jasmine'],
		plugins: ['karma-*'],
		files: [
			'Tests/**/*.js',
			'Dist/ComponentDomParser.js'
		],
		reporters: ['coverage', 'dots'],
		colors: true,

		// Level of logging.
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: karmaConfig.LOG_ERROR,
		autoWatch: false,
		captureTimeout: 60000,
		singleRun: true,
		browsers: ['PhantomJS'],

		// Add commonJS support and create the code coverage.
		preprocessors: {
			'Dist/ComponentDomParser.js': ['coverage']
		},

		// Specify the location of the coverage report.
		coverageReporter: {
			reporters: [{
				type: 'text-summary',
				dir: 'Tests/Coverages/'
			}, {
				type: 'html',
				dir: 'Tests/Coverages/'
			}, {
				type: 'lcov',
				dir: 'Tests/Coverages/'
			}]
		},
	});
};
