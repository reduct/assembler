/* @reduct/assembler x.x.x | @license MIT */

var buildTools = require('@reduct/build-tools');
var assembler = require('./../Dist/Assembler.js');
var chai = buildTools.chai;
var DOM = buildTools.mock;
var expect = chai.expect;

describe('The "Assembler"', function suite () {
    var mock = '' +
        '<!doctype html>' +
        '<html>' +
            '<head></head>' +
            '<body>' +
                '<div data-foo="MyComponent"></div>' +
                '<div data-component="MyComponent"></div>' +
            '</body>' +
        '</html>';

    beforeEach(function before (done) {
        return DOM.create(mock, done);
    });

    it('should be able to create an app', function test (done) {
        var app = assembler();

        expect(app.register).to.be.a('function');
        expect(app.run).to.be.a('function');

        done();
    });

    it('should be able to register component instances', function test (done) {
        var app = assembler();

        function MyComponent () {}

        app.register(MyComponent);

        expect(Object.keys(app.index).length).to.equal(1);
        expect(Object.keys(app.index)[0]).to.equal(MyComponent.name);

        done();
    });

    it('should be able to register component instances with different names', function test (done) {
        var app = assembler();
        var name = 'FooComponent';

        function MyComponent () {};

        app.register(MyComponent, name);

        expect(Object.keys(app.index).length).to.equal(1);
        expect(Object.keys(app.index)[0]).to.equal(name);

        done();
    });

    it('should be able to register a bunch of components at once', function test (done) {
        var app = assembler();

        function ComponentOne () {}
        function ComponentTwo () {}

        app.registerAll({
            ComponentOne: ComponentOne,
            'ComponentFoo': ComponentTwo
        });

        expect(Object.keys(app.index).length).to.equal(2);
        expect(Object.keys(app.index)[0]).to.equal('ComponentOne');
        expect(Object.keys(app.index)[1]).to.equal('ComponentFoo');

        done();
    });

    it('should be able to instantiate components', function test (done) {
        var app = assembler();
        var components;

        function MyComponent () {
            this.id = 'foo';
        }

        app.register(MyComponent);
        app.run();

        components = app.components['MyComponent'];

        expect(Object.keys(app.components).length).to.equal(1);

        expect(components.length).to.equal(1);
        expect(components[0].id).to.equal('foo');

        done();
    });

    it('should provide a possibility to call `run` multiple times without polluting the `components` data structure', function test (done) {
        var app = assembler();

        function MyComponent () {
            this.id = 'foo';
        }

        app.register(MyComponent);
        app.run();

        expect(app.components['MyComponent'].length).to.equal(1);

        app.run();

        // Should still be only one component
        expect(app.components['MyComponent'].length).to.equal(1);

        done();
    });

    it('should be able to use a custom marker option.', function test (done) {
        var app = assembler({
            marker: 'foo'
        });

        function MyComponent () {
            this.id = 'foo';
        }

        app.register(MyComponent);
        app.run();

        expect(app.components['MyComponent'][0].id).to.equal('foo');

        done();
    });

    it('should provide a chainable API', function test (done) {
        var app = assembler();

        function MyComponent () {
            this.id = 'foo';
        }

        expect(app.register(MyComponent).constructor.name).to.equal('Assembler');
        expect(app.registerAll({MyComponent: MyComponent}).constructor.name).to.equal('Assembler');
    
        done();
    });
});
