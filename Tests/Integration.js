describe('ComponentDomParser: Integration', function() {
    it('should create a new instance of an Constructor if a matching element with the data-attribute was found', function() {
        var resultString = 'Constructor "Example" was';
        var testElement = document.createElement('div');
        var componentIndex = {
            Example: function(el, dataset) {
                console.log('Yeah');
                this.el = el;
                this.el.innerHTML = resultString
            }
        }
        var moduleParserInstance = new window.ComponentDomParser({
            dataSelector: 'app',
            componentIndex: componentIndex
        });

        testElement.setAttribute('data-app', 'Example');
        document.body.appendChild(testElement);

        moduleParserInstance.parse();

        expect(testElement.innerHTML).toBe(resultString);
    });
});
