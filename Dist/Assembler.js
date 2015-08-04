/**
 *
 * @name @reduct/assembler
 * @version 1.0.0
 * @license MIT
 *
 * @author Tyll Weiß <inkdpixels@gmail.com>
 * @author André König <andre.koenig@posteo.de>
 * @author Wilhelm Behncke
 *
 */

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (factory) {
    var version = {
        major: 1,
        minor: 0,
        patch: 0
    };
    var world;

    if (typeof window !== "undefined") {
        world = window;
    } else if (typeof global !== "undefined") {
        world = global;
    } else if (typeof self !== "undefined") {
        world = self;
    } else {
        world = this;
    }

    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(world, version);
    } else if (typeof define === "function" && define.amd) {
        define([], function () {
            return factory(world, version);
        });
    } else {
        world.reductAssembler = factory(world, version);
    }
})(function factory(global, version) {

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
         */

        function Assembler() {
            _classCallCheck(this, Assembler);

            this.marker = 'component';
            this.selector = "data-" + this.marker;

            this.index = {};
            this.components = {};
        }

        //
        // Create the `assembler` factory function.
        // This factory will create a new instance of the `assembler` and exposes the API
        //

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

        _createClass(Assembler, [{
            key: "instantiate",
            value: function instantiate(element) {
                var name = element.getAttribute(this.selector);

                var components = this.components[name] = [].slice.call(this.components[name] || []);
                var Component = this.index[name];

                components.unshift(new Component(element));
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
            key: "register",
            value: function register(ComponentClass, name) {
                var type = typeof ComponentClass;

                if (type !== 'function') {
                    throw new Error("'" + type + "' is not a valid component class.");
                }

                name = name || ComponentClass.name;

                this.index[name] = ComponentClass;
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
            key: "registerAll",
            value: function registerAll(classMap) {
                var _this = this;

                Object.keys(classMap).forEach(function (name) {
                    return _this.register(classMap[name], name);
                });
            }

            /**
             * "Parse" the DOM for component declarations and
             * instantiate the actual, well, components.
             *
             */
        }, {
            key: "run",
            value: function run() {
                var _this2 = this;

                var elements = [].slice.call(document.querySelectorAll("[" + this.selector + "]"));
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

    var assembler = function assembler() {
        var assembler = new Assembler();

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
        if (process && process.title && !! ~process.title.indexOf('reduct')) {
            api.index = assembler.index;
            api.components = assembler.components;
        }

        return api;
    };

    //
    // Add the version information to the factory function.
    //
    assembler.version = version;

    return assembler;
});