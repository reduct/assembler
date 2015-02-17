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

    afterEach(function() {
        document.body.removeChild(testElement);
    });
});
