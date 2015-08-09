function factory (global, factoryOpts) {

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
    class Assembler {

        /**
         * Initializes the empty component class index
         * and the actual component instance cache.
         *
         * @param {object} opts Overwritten default options
         *
         */
        constructor (opts = { marker: 'component' }) {
            this.marker = opts.marker;
            this.selector = `data-${this.marker}`;

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
        getFunctionName (fn) {
            if (Object.prototype.toString.call(fn) !== '[object Function]') {
                throw new Error(`${fn} is not a valid function.`);
            }

            let regexe = /^\s*function\s*([^\(]*)/im;

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
        isInstantiated (element) {
            return !!~this.elements.indexOf(element);
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
        instantiate (element) {
            if (!this.isInstantiated(element)) {
                let name = element.getAttribute(this.selector);

                let components = this.components[name] = [].slice.call(this.components[name] || []);
                let Component = this.index[name];

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
        register (ComponentClass, name) {
            let type = typeof ComponentClass;

            if (type !== 'function') {
                throw new Error(`'${type}' is not a valid component class.`);
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
        registerAll (classMap) {
            Object.keys(classMap).forEach((name) => this.register(classMap[name], name));

            return this;
        }

        /**
         * "Parse" the DOM for component declarations and
         * instantiate the actual, well, components.
         *
         */
        run () {
            let elements = [].slice.call(document.querySelectorAll(`[${this.selector}]`));
            let names = Object.keys(this.index);

            //
            // Find all instantiable elements.
            // Note: `getAttribute` has to be used due to: https://github.com/tmpvar/jsdom/issues/961
            //
            elements
                .filter((element) => !!~names.indexOf(element.getAttribute(this.selector)))
                .forEach((element) => this.instantiate(element));
        }
    }

    //
    // Create the `assembler` factory function.
    // This factory will create a new instance of the `assembler` and exposes the API
    //
    let assembler = (opts) => {
        let assembler = new Assembler(opts);

        //
        // Shard the actual front-facing API (for not leaking private methods and properties).
        //
        let api = {
            register: (ComponentClass, name) => assembler.register(ComponentClass, name),
            registerAll: (classMap) => assembler.registerAll(classMap),
            run: () => assembler.run()
        };

        //
        // Expose additional attributes for the tests.
        //
        if (factoryOpts.isTestingEnv) {
            api.index = assembler.index;
            api.components = assembler.components;
        }

        return api;
    };

    //
    // Add the version information to the factory function.
    //
    assembler.version = factoryOpts.packageVersion;

    return assembler;
}
