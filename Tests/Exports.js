describe('ComponentDomParser: Exports', function() {
    it('should be defined in the global scope.', function() {
        expect(window.ComponentDomParser).toBeDefined();
    });

    // ToDO: Test support for CJS & AMD.
});
