describe('ComponentDomParser: Internals', function() {
    it('should throw an error if no options were defined', function() {
        expect(function() {
            var moduleParserInstance = new window.ComponentDomParser();
        }).toThrow(new Error('ComponentDomParser Error: No option object was specified.'));
    });

    it('should throw an error if no dataSelector was specified', function() {
        expect(function() {
            var moduleParserInstance = new window.ComponentDomParser({
                componentIndex: {}
            });
        }).toThrow(new Error('ComponentDomParser Error: No dataSelector was specified.'));
    });

    it('should throw an error if no componentIndex was specified', function() {
        expect(function() {
            var moduleParserInstance = new window.ComponentDomParser({
                dataSelector: 'app'
            });
        }).toThrow(new Error('ComponentDomParser Error: No componentIndex was specified.'));
    });

    it('should throw an error if the "componentDidMountCallback" value is not a function', function() {
        expect(function() {
            var moduleParserInstance = new window.ComponentDomParser({
                dataSelector: 'app',
                componentIndex: {},
                componentDidMountCallback: 'Not a function'
            });
        }).toThrow(new Error('ComponentDomParser Error: The componentDidMountCallback option must be a function.'));
    });
});
