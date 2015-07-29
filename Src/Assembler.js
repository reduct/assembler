function factory (global, version) {

    /**
     * DRAFT
     *
     * import MyComponent from 'MyComponent';
     * import YetAnotherComponent from 'YetAnotherComponent';
     *
     * let app = assembler();
     *
     * app.register(MyComponent);
     * app.register(YetAnotherComponent)
     *
     * app.boot();
     *
     *
     */

    class Assembler {

        constructor() {
            this.marker = 'component';
            this.selector = `data-${this.marker}`;

            this.index = {};
            this.components = {};
        }

        instantiate(element) {
            let name = element.getAttribute(this.selector);

            let components = this.components[name] = [].slice.call(this.components[name] || []);
            let Component = this.index[name];

            components.unshift(new Component(element));
        }

        register(ComponentClass) {
            let type = typeof ComponentClass;

            if (type !== 'function') {
                throw new Error(`'${type}' is not a valid component class.`);
            }

            let name = ComponentClass.name;

            this.index[name] = ComponentClass;
        }

        boot() {
            console.log(this.selector);
            let elements = [].slice.call(document.querySelectorAll(`[${this.selector}]`));
            let names = Object.keys(this.index);

            //
            // Find all elements which are instantiable.
            // Note: `getAttribute` has to be used due to: https://github.com/tmpvar/jsdom/issues/961
            //
            elements
                .filter((element) => !!~names.indexOf(element.getAttribute(this.selector)))
                .forEach((element) => this.instantiate(element));
        }
    }

    return {
        Assembler: () => {
            let assembler = new Assembler();

            let api = {
                register: (ComponentClass) => assembler.register(ComponentClass),
                boot: () => assembler.boot()
            };

            //
            // Expose additional attributes for assertions.
            //
            if (process && process.title && !!~process.title.indexOf('reduct')) {
                api.index = assembler.index;
                api.components = assembler.components;
            }

            return api;
        },

        version: version
    };
}
