describe('ComponentDomParser: Integration', function() {
    var testElement;

    beforeEach(function() {
        testElement = document.createElement('div');
        testElement.setAttribute('data-app', 'Example');
        document.body.appendChild(testElement);
    });

    it('should create a new instance of an Constructor if a matching element with the data-attribute was found', function() {
        var resultString = 'Constructor "Example" was';

        var componentIndex = {
            Example: function(el, dataset) {
                this.el = el;
                this.el.innerHTML = resultString
            }
        }
        var moduleParserInstance = new window.ComponentDomParser({
            dataSelector: 'app',
            componentIndex: componentIndex
        });

        moduleParserInstance.parse();

        expect(testElement.innerHTML).toBe(resultString);
    });

    it('should call the "componentDidMountCallback" fn after every initialization of an Constructor', function() {
        var componentIndex = {
            Example: function(el, dataset) {}
        }
        var callbacks = {
            componentDidMountCallback: function(instance) {}
        }
        spyOn(callbacks, 'componentDidMountCallback');
        var moduleParserInstance = new window.ComponentDomParser({
            dataSelector: 'app',
            componentIndex: componentIndex,
            componentDidMountCallback: callbacks.componentDidMountCallback
        });

        moduleParserInstance.parse();

        expect(callbacks.componentDidMountCallback).toHaveBeenCalled();
    });

    it('should call a matching nonIndexedComponentPoliciy handler when the desired module is not listed under "componentIndex"', function() {
        var moduleParserInstance = new window.ComponentDomParser({
                dataSelector: 'app',
                componentIndex: {},
                nonIndexedComponentPolicies: {
                    'Example' : function(componentKey) {
                        return function(el, dataset) {
                          el.innerHTML = 'Fallback found "' + componentKey + '" key';
                        };
                    }
                }
            });

        moduleParserInstance.parse();

        expect(testElement.innerHTML).toBe('Fallback found "Example" key');
    });

    it('should allow nonIndexedComponentPoliciies rules to be defined with wild cards', function() {
        testElement.setAttribute('data-app', 'Some/Example');
        var moduleParserInstance = new window.ComponentDomParser({
                dataSelector: 'app',
                componentIndex: {},
                nonIndexedComponentPolicies: {
                    'Some/*' : function(componentKey) {
                        return function(el, dataset) {
                          el.innerHTML = 'Fallback found "' + componentKey + '" key';
                        };
                    }
                }
            });

        moduleParserInstance.parse();

        expect(testElement.innerHTML).toBe('Fallback found "Some/Example" key');
    });

    it('should let fallback handlers decide whether their appliance was successful or not', function() {
        var policies = {
            'Example' : function() {},
            '*' : function() {}
        };
        var moduleParserInstance = new window.ComponentDomParser({
            dataSelector: 'app',
            componentIndex: {},
            nonIndexedComponentPolicies: policies
        });

        spyOn(policies, 'Example');
        spyOn(policies, '*').and.returnValue(function(el, dataset) {
          el.innerHTML = 'This would match all the time.';
        });

        moduleParserInstance.parse();

        expect(policies['Example']).toHaveBeenCalled();
        expect(policies['*']).toHaveBeenCalled();
        expect(testElement.innerHTML).toBe('This would match all the time.');
    });

    it('should exit fallback chain after the first successful appliance', function() {
        var policies = {
            'Example' : function() {},
            'Ex*' : function() {},
            '*' : function() {}
        };
        var moduleParserInstance = new window.ComponentDomParser({
            dataSelector: 'app',
            componentIndex: {},
            nonIndexedComponentPolicies: policies
        });

        spyOn(policies, 'Example');
        spyOn(policies, 'Ex*').and.returnValue(function(el, dataset) {
          el.innerHTML = 'Second Rule applied.';
        });
        spyOn(policies, '*');

        moduleParserInstance.parse();

        expect(policies['Example']).toHaveBeenCalled();
        expect(policies['Ex*']).toHaveBeenCalled();
        expect(policies['*']).not.toHaveBeenCalled();
        expect(testElement.innerHTML).toBe('Second Rule applied.');
    });

    it('should add the new Component passed to the addComponent() method to the internal componentIndex', function() {
        var resultString = 'Constructor "Example" was mounted.';
        var moduleParserInstance = new window.ComponentDomParser({
            dataSelector: 'app',
            componentIndex: {}
        });

        moduleParserInstance.addComponent('Example', function(el) {
            el.innerHTML = resultString;
        });

        moduleParserInstance.parse();

        expect(testElement.innerHTML).toBe(resultString);
    });

    afterEach(function() {
        document.body.removeChild(testElement);
    });
});
