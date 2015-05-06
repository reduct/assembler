/* ComponentDomParser 0.0.2 | @license MIT */

(function(global, factory) {
    'use strict';

    // If the env is browserify, export the factory using the module object.
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(global);

    // If the env is AMD, register the Module as 'ComponentDomParser'.
    } else if (global.define && typeof global.define === "function" && global.define.amd) {
        global.define("ComponentDomParser", [], function() {
            return factory(global);
        });

    // If the env is a browser(without CJS or AMD support), export the factory into the global window object.
    } else {
        global.ComponentDomParser = factory(global);
    }
}(window, function(global) {
    'use strict';

    const doc = global.document;

    /*
     * ComponentDomParser
     * @param options {Object} The options Object which initializes the parser.
     * @example
     * // Initialize a new instance of the ComponentDomParser.
     * var parser = new window.ComponentDomParser({
     *     dataSelector: 'app',
     *     componentIndex: {
     *         'myApplication': function(el) { el.innerHTML = 'myApplication initialized!' }
     *     },
     *     componentDidMountCallback: function(instance) {
     *         console.log(instance);
     *     }
     * });
     *
     * // Parse the document for all [data-app] nodes.
     * parser.parse();
     * @constructor
     */
    let ComponentDomParser = function(options) {
        this._checkForRequiredConstants(options);

        this.dataSelector = options.dataSelector;
        this.componentIndex = options.componentIndex;
        this.componentDidMountCallback = options.componentDidMountCallback;

        this.nonIndexedComponentPolicies = options.nonIndexedComponentPolicies || null;
        this._fallbackRules = options.nonIndexedComponentPolicies ? Object.keys(options.nonIndexedComponentPolicies) : null;
        this._fallbackRulesRegex = this._fallbackRules ? this._fallbackRules.map(function(fallbackRule) {
            return new RegExp('^' + fallbackRule.replace(/[^\w\s]/g, '\$&').replace(/\*/g, '\\w+') + '$');
        }) : null;
        this._mountedElementsCache = [];
    };

    ComponentDomParser.prototype._checkForRequiredConstants = function(options) {
        if(!options) {
            throw new Error('ComponentDomParser Error: No option object was specified.');
        }

        if(!options.dataSelector) {
            throw new Error('ComponentDomParser Error: No dataSelector was specified.');
        }

        if(!options.componentIndex) {
            throw new Error('ComponentDomParser Error: No componentIndex was specified.');
        }

        if(options.componentDidMountCallback && typeof(options.componentDidMountCallback) !== 'function') {
            throw new Error('ComponentDomParser Error: The componentDidMountCallback option must be a function.');
        }
    };

    ComponentDomParser.prototype.parse = function(contextElement) {
        contextElement = contextElement || doc.body;

        let elementNodeList = contextElement.querySelectorAll('[data-' + this.dataSelector + ']');
        let elementNodes = Array.prototype.slice.call(elementNodeList,0);
        let self = this;

        elementNodes.forEach(function(node) {
            let componentKey = node.dataset[self.dataSelector];
            let Component = self.componentIndex[componentKey] || self._getNonIndexComponentPolicy(node, componentKey);

            if(Component) {
                if(self._mountedElementsCache.indexOf(node) < 0) {
                    self._mountComponent(node, Component);
                }
            } else {
                console.info('ComponentDomParser Info: Component "' + componentKey + '" is not present in the passed componentIndex:', self.componentIndex);
            }
        });

        return this;
    };

    ComponentDomParser.prototype._mountComponent = function(node, Component) {
        let instance = new Component(node);

        this._mountedElementsCache.push(node);

        if(this.componentDidMountCallback) {
            this.componentDidMountCallback(instance);
        }

        return instance;
    };

    ComponentDomParser.prototype._getNonIndexComponentPolicy = function(node, componentKey) {
        let nonIndexedComponentPolicies = this.nonIndexedComponentPolicies;

        if (nonIndexedComponentPolicies) {
            let fallbackRule = null;
            let fallbackRuleRegex = null;

            for (let i = 0; (fallbackRule = this._fallbackRules[i]) && (fallbackRuleRegex = this._fallbackRulesRegex[i]); i++) {
                if (componentKey.match(fallbackRuleRegex)) {
                    let fallbackHandler = nonIndexedComponentPolicies[fallbackRule];
                    let result = fallbackHandler(componentKey, node);

                    if (result) {
                        return result;
                    }
                }
            }
        }

        return false;
    };

    return ComponentDomParser;
}));
