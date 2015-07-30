/* @reduct/assembler x.x.x | @license MIT */

var chai = require('chai');
var assembler = require('./../Dist/Assembler.js');
var DOM = require('./Helpers/DOM');

var expect = chai.expect;

describe('The "Assembler"', function() {
    var mock = '' +
        '<html>' +
            '<head></head>' +
            '<body>' +
                '<div data-component="MyComponent"></div>' *
            '</body>' +
        '</html>';

    beforeEach(function(done) {
        return DOM.create(mock, done);
    });

    it('should be able to create an app', function(done) {
        var app = assembler.Assembler();

        expect(app.register).to.be.a('function');
        expect(app.run).to.be.a('function');

        done();
    });

    it('should be able to register component instances', function(done) {
        var app = assembler.Assembler();

        function MyComponent() {
        }

        app.register(MyComponent);

        expect(Object.keys(app.index).length).to.equal(1);
        expect(Object.keys(app.index)[0]).to.equal(MyComponent.name);

        done();
    });

    it('should be able to instantiate components', function(done) {
        var app = assembler.Assembler();
        var components;

        function MyComponent () {
            this.id = 'foo';
        }

        app.register(MyComponent);
        app.run();

        components = app.components[MyComponent.name];

        expect(Object.keys(app.components).length).to.equal(1);

        expect(components.length).to.equal(1);
        expect(components[0].id).to.equal('foo');

        done();
    });
});
