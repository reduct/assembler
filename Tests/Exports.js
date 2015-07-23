describe('Assembler: Exports', function() {
    it('should be defined in the global scope.', function() {
        expect(window.reductAssembler).toBeDefined();
    });

    // ToDO: Test support for CJS & AMD.
});
