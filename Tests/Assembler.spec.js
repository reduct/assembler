/* @reduct/assembler x.x.x | @license MIT */

import chai from 'chai';
import assembler from './../Dist/Assembler.js';
import DOM from './Helpers/DOM';

let expect = chai.expect;

describe('The "Assembler"', () => {
    let mock = `
        <html>
            <head></head>
            <body>
                <div data-component="MyComponent"></div>
            </body>
        </html>
    `;

    beforeEach((done) => DOM.create(mock, done));

    it('should be able to create an app', (done) => {
        let app = assembler.Assembler();

        expect(app.register).to.be.a('function');
        expect(app.boot).to.be.a('function');

        done();
    });

    it('should be able to register component instances', (done) => {
        let app = assembler.Assembler();

        function MyComponent() {
        }

        app.register(MyComponent);

        expect(Object.keys(app.index).length).to.equal(1);
        expect(Object.keys(app.index)[0]).to.equal(MyComponent.name);

        done();
    });

    it('should be able to instantiate components', (done) => {
        function MyComponent () {
            this.id = 'foo';
        }

        let app = assembler.Assembler();

        app.register(MyComponent);

        app.boot();

        expect(Object.keys(app.components).length).to.equal(1);

        let components = app.components[MyComponent.name];

        expect(components.length).to.equal(1);
        expect(components[0].id).to.equal('foo');

        done();
    });

});