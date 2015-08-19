/**
 *
 * @name @reduct/assembler
 * @version 1.1.0
 * @license MIT
 *
 * @author Tyll Weiß <inkdpixels@gmail.com>
 * @author André König <andre.koenig@posteo.de>
 * @author Wilhelm Behncke
 *
 */


(function () {
    var reductOpts = {
        isTestingEnv: false,
        packageVersion: {
            major: 1,
            minor: 1,
            patch: 0
        }
    };
    var world = this;

    // Check for globals.
    if (typeof window !== "undefined") {
        world = window;
    } else if (typeof global !== "undefined") {
        world = global;
    } else if (typeof self !== "undefined") {
        world = self;
    }

    // Execute the isTestingEnv check.
    reductOpts.isTestingEnv = world.process && world.process.title && !!~world.process.title.indexOf('reduct');

    return (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reductAssembler = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global reductOpts*/

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _reductLogger = require('@reduct/logger');

var assemblerLogger = _reductLogger.logger.getLogger('@reduct/assembler');

/**
 * The Assembler.
 *
 * An assembler instance acts as the central point of your
 * application. It is responsible for connecting DOM nodes with
 * actual component instances through exposed interfaces. Those
 * interfaces provides the functionality for registering component
 * classes and bootstrapping the whole application.
 *
 * Usage example:
 *
 *     import assembler from 'assembler';
 *
 *     // Importing your actual components
 *     import MyComponent from 'my-component';
 *     import AnotherComponent from 'another-component';
 *
 *     const app = assembler();
 *
 *     app.register(MyComponent);
 *     app.register(AnotherComponent, 'NewsComponent');
 *
 *     // Start the application (will parse the DOM and mount the
 *     // component instances).
 *     app.run();
 *
 */

var Assembler = (function () {

    /**
     * Initializes the empty component class index
     * and the actual component instance cache.
     *
     * @param {object} opts Overwritten default options
     *
     */

    function Assembler() {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? { marker: 'component' } : arguments[0];

        _classCallCheck(this, Assembler);

        this.marker = opts.marker;
        this.selector = 'data-' + this.marker;

        this.index = {};

        //
        // The actual instantiated components.
        //
        // Structure:
        //
        //     {
        //         'ComponentClassName': [object, object],
        //         'YetAnotherComponentClassName': [object]
        //     }
        //
        this.components = {};

        //
        // A cache of DOM elements.
        //
        // This is for checking if a component has already been instantiated.
        //
        // TODO: Refactoring: Find another way (with good performance) to combine this
        // array with the `components` object.
        //
        this.elements = [];
    }

    //
    // Create the `assembler` factory function.
    // This factory will create a new instance of the `assembler` and exposes the API
    //

    /**
     * @private
     *
     * Parses the function name out of `Function.prototype.toString()`.
     *
     * TODO: Move into Utilities when supported by `build-tools`.
     *
     * @param {Function} The function from which the name should be extracted.
     * @returns {string} The actual name (`anonymous` when the function does not provide a name).
     *
     */

    _createClass(Assembler, [{
        key: 'getFunctionName',
        value: function getFunctionName(fn) {
            if (Object.prototype.toString.call(fn) !== '[object Function]') {
                assemblerLogger.error(fn + ' is not a valid function.');
            }

            var regexe = /^\s*function\s*([^\(]*)/im;

            return fn.name || regexe.exec(fn.toString())[1] || 'anonymous';
        }

        /**
         * @private
         *
         * Checks if a component has already been instantiated.
         *
         * @param {DOMElement} element The element which should be connected to a component.
         *
         * @returns {boolean}
         *
         */
    }, {
        key: 'isInstantiated',
        value: function isInstantiated(element) {
            return !! ~this.elements.indexOf(element);
        }

        /**
         * @private
         *
         * Instantiates a component by a given DOM node.
         *
         * Will extract the component's name out of the DOM nodes `data`
         * attribute, instantiates the actual component object and pushes
         * the instance to the internal `components` index.
         *
         * @param {HTMLElement} element The component's root DOM node.
         *
         */
    }, {
        key: 'instantiate',
        value: function instantiate(element) {
            if (!this.isInstantiated(element)) {
                var _name = element.getAttribute(this.selector);

                var components = this.components[_name] = [].slice.call(this.components[_name] || []);
                var Component = this.index[_name];

                this.elements.unshift(element);

                components.unshift(new Component(element));
            }
        }

        /**
         * Registers a component class.
         *
         * Usage example
         *
         *     app.register(MyComponent); // Name: 'MyComponent'
         *
         *     app.register(MyComponent, 'FooComponent'); // Name: 'FooComponent'
         *
         * @param {Function} ComponentClass The component class which should be registered.
         * @param {string} name An alternative name (optional)
         *
         */
    }, {
        key: 'register',
        value: function register(ComponentClass, name) {
            var type = typeof ComponentClass;

            if (type !== 'function') {
                throw new Error('\'' + type + '\' is not a valid component class.');
            }

            name = name || this.getFunctionName(ComponentClass);

            this.index[name] = ComponentClass;

            return this;
        }

        /**
         * Takes a hashmap with multiple component classes
         * and registers them at once.
         *
         * Usage example:
         *
         *     app.registerAll({
         *         MyComponent: MyComponent,        // name: 'MyComponent'
         *         'AnotherComponent': FooComponent // name: 'AnotherComponent'
         *     });
         *
         *     // With destructuring
         *     app.registerAll({MyComponent, FooComponent});
         *
         * @param {object} classMap A map with multiple component classes.
         *
         */
    }, {
        key: 'registerAll',
        value: function registerAll(classMap) {
            var _this = this;

            Object.keys(classMap).forEach(function (name) {
                return _this.register(classMap[name], name);
            });

            return this;
        }

        /**
         * "Parse" the DOM for component declarations and
         * instantiate the actual, well, components.
         *
         */
    }, {
        key: 'run',
        value: function run() {
            var _this2 = this;

            var elements = [].slice.call(document.querySelectorAll('[' + this.selector + ']'));
            var names = Object.keys(this.index);

            //
            // Find all instantiable elements.
            // Note: `getAttribute` has to be used due to: https://github.com/tmpvar/jsdom/issues/961
            //
            elements.filter(function (element) {
                return !! ~names.indexOf(element.getAttribute(_this2.selector));
            }).forEach(function (element) {
                return _this2.instantiate(element);
            });
        }
    }]);

    return Assembler;
})();

var assembler = function assembler(opts) {
    var assembler = new Assembler(opts);

    //
    // Shard the actual front-facing API (for not leaking private methods and properties).
    //
    var api = {
        register: function register(ComponentClass, name) {
            return assembler.register(ComponentClass, name);
        },
        registerAll: function registerAll(classMap) {
            return assembler.registerAll(classMap);
        },
        run: function run() {
            return assembler.run();
        }
    };

    //
    // Expose additional attributes for the tests.
    //
    if (reductOpts.isTestingEnv) {
        api.index = assembler.index;
        api.components = assembler.components;
    }

    return api;
};

//
// Add the version information to the factory function.
//
assembler.version = reductOpts.packageVersion;

exports['default'] = assembler;
module.exports = exports['default'];

},{"@reduct/logger":2}],2:[function(require,module,exports){
(function (global){
/**
 *
 * @name @reduct/logger
 * @version 1.0.2
 * @license MIT
 *
 * @author Tyll Weiß <inkdpixels@gmail.com>
 * @author André König <andre.koenig@posteo.de>
 * @author Wilhelm Behncke
 *
 */


(function () {
    var reductOpts = {
        isTestingEnv: false,
        packageVersion: {
            major: 1,
            minor: 0,
            patch: 2
        }
    };
    var world = this;

    // Check for globals.
    if (typeof window !== "undefined") {
        world = window;
    } else if (typeof global !== "undefined") {
        world = global;
    } else if (typeof self !== "undefined") {
        world = self;
    }

    // Execute the isTestingEnv check.
    reductOpts.isTestingEnv = world.process && world.process.title && !!~world.process.title.indexOf('reduct');

    return (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.logger = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*global reductOpts*/

/**
 * @private
 *
 * Checks if the given argument is a Number.
 *
 * @param num {*} The argument which will be validated.
 * @returns {boolean}
 *
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _isNumeric(num) {
    return !isNaN(num);
}

var logLevels = {
    ALL: 2,
    WARNINGS: 1,
    SILENT: 0
};

var Logger = (function () {
    /**
     * Sets up internal properties for the logger.
     *
     * @param namespace {String} The optional namespace for the logger.
     * @param logLevel {Number} The optional initial logLevel for the logger.
     */

    function Logger() {
        var namespace = arguments.length <= 0 || arguments[0] === undefined ? '@reduct/logger' : arguments[0];
        var logLevel = arguments.length <= 1 || arguments[1] === undefined ? logLevels.ALL : arguments[1];

        _classCallCheck(this, Logger);

        this.version = reductOpts.packageVersion;
        this.logLevel = logLevel;
        this.namespace = namespace;

        this.instances = [];
    }

    //
    // Check for the existence of an logger instance in the global namespace,
    // and if none was found create a singleton.
    //

    /**
     * Returns customized version of the logger API.
     *
     * @param namespace {String} The namespace of the new logger instance.
     */

    _createClass(Logger, [{
        key: 'getLogger',
        value: function getLogger() {
            var namespace = arguments.length <= 0 || arguments[0] === undefined ? this.namespace : arguments[0];

            var logger = new Logger(namespace, this.logLevel);

            this.instances.push(logger);

            return {
                log: function log(message, appendix) {
                    logger.log(message, appendix);
                },

                info: function info(message, appendix) {
                    logger.info(message, appendix);
                },

                warn: function warn(message, appendix) {
                    logger.warn(message, appendix);
                },

                error: function error(message, appendix) {
                    logger.error(message, appendix);
                }
            };
        }

        /**
         * Adjusts the noise of the centralized instance of the logger.
         * 0 => No messages are displayed
         * 1 => Only severe messages are displayed
         * 2 => Every message is displayed
         *
         * @param int {Number} The new log level.
         * @returns {Logger}
         *
         */
    }, {
        key: 'setLogLevel',
        value: function setLogLevel(int) {
            var logLevel = _isNumeric(int) ? int : 2;

            this.logLevel = logLevel;

            this.instances.forEach(function (logger) {
                logger.logLevel = logLevel;
            });

            return this;
        }

        /**
         * Logs a message to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param appendix {*} An optional appendix for the log.
         * @returns {Logger}
         *
         */
    }, {
        key: 'log',
        value: function log(message) {
            var appendix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (this.logLevel < logLevels.ALL) {
                return this;
            }

            try {
                console.log(this.namespace + ': ' + message, appendix);
            } catch (e) {}

            return this;
        }

        /**
         * Logs a info to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param appendix {*} An optional appendix for the info log.
         * @returns {Logger}
         *
         */
    }, {
        key: 'info',
        value: function info(message) {
            var appendix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (this.logLevel < logLevels.ALL) {
                return this;
            }

            try {
                console.info(this.namespace + ' Info: ' + message, appendix);
            } catch (e) {}

            return this;
        }

        /**
         * Logs a warning to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param appendix {*} An optional appendix for the warning.
         * @returns {Logger}
         *
         */
    }, {
        key: 'warn',
        value: function warn(message) {
            var appendix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (this.logLevel < logLevels.WARNINGS) {
                return this;
            }

            try {
                console.warn(this.namespace + ' Warning: ' + message, appendix);
            } catch (e) {}
        }

        /**
         * Logs a error to the console API if possible.
         *
         * @param message {String} The message to log.
         * @param appendix {*} An optional appendix for the error log.
         * @returns {Logger}
         *
         */
    }, {
        key: 'error',
        value: function error(message) {
            var appendix = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

            if (this.logLevel < logLevels.SILENT) {
                return this;
            }

            if (appendix !== '') {
                try {
                    // We still need the console.error call since the Error object can't print out references to HTML Elements/Objects etc.
                    console.error(message, appendix);
                } catch (e) {}

                if (!reductOpts.isTestingEnv) {
                    throw new Error(this.namespace + ' Error: Details are posted above.');
                }
            } else {
                if (!reductOpts.isTestingEnv) {
                    throw new Error(this.namespace + ' Error: ' + message);
                }
            }
        }
    }]);

    return Logger;
})();

if (!(global.reductLogger instanceof Logger)) {
    var logger = new Logger();

    //
    // Reduce the logging noise for the unit tests.
    //
    if (reductOpts.isTestingEnv) {
        logger.setLogLevel(0);
    }

    global.reductLogger = logger;
}

exports['default'] = {
    logger: global.reductLogger,
    logLevels: logLevels
};
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
}());
                
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
}());
                