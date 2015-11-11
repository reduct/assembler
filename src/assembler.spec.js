import assembler from './assembler.js';
import chai from 'chai';
import {DOM} from './utils/';

const expect = chai.expect;

describe('The "Assembler"', () => {
	const mock = `
  <!doctype html>
  <html>
	  <head></head>
	  <body>
		  <div data-foo="MyComponent"></div>
		  <div data-component="MyComponent"></div>
	  </body>
  </html>`;

	beforeEach(done => {
		return DOM.create(mock, done);
	});

	it('should be able to create an app', done => {
		const app = assembler();

		expect(app.register).to.be.a('function');
		expect(app.run).to.be.a('function');

		done();
	});

	it('should be able to register component instances', done => {
		const app = assembler();

		function MyComponent() {}

		app.register(MyComponent);

		expect(Object.keys(app.index).length).to.equal(1);
		expect(Object.keys(app.index)[0]).to.equal(MyComponent.name);

		done();
	});

	it('should be able to register component instances with different names', done => {
		const app = assembler();
		const name = 'FooComponent';

		function MyComponent() {}

		app.register(MyComponent, name);

		expect(Object.keys(app.index).length).to.equal(1);
		expect(Object.keys(app.index)[0]).to.equal(name);

		done();
	});

	it('should be able to register a bunch of components at once', done => {
		const app = assembler();

		function ComponentOne() {}
		function ComponentTwo() {}

		app.registerAll({
			FirstComponent: ComponentOne,
			SecondComponent: ComponentTwo
		});

		expect(Object.keys(app.index).length).to.equal(2);
		expect(Object.keys(app.index)[0]).to.equal('FirstComponent');
		expect(Object.keys(app.index)[1]).to.equal('SecondComponent');

		done();
	});

	it('should be able to instantiate components', done => {
		const app = assembler();
		let components;

		function MyComponent() {
			this.id = 'foo';
		}

		app.register(MyComponent);
		app.run();

		components = app.components.MyComponent;

		expect(Object.keys(app.components).length).to.equal(1);

		expect(components.length).to.equal(1);
		expect(components[0].id).to.equal('foo');

		done();
	});

	it('should provide a possibility to call `run` multiple times without polluting the `components` data structure', done => {
		const app = assembler();

		function MyComponent() {
			this.id = 'foo';
		}

		app.register(MyComponent);
		app.run();

		expect(app.components.MyComponent.length).to.equal(1);

		app.run();

		// Should still be only one component
		expect(app.components.MyComponent.length).to.equal(1);

		done();
	});

	it('should be able to use a custom marker option.', done => {
		const app = assembler({
			marker: 'foo'
		});

		function MyComponent() {
			this.id = 'foo';
		}

		app.register(MyComponent);
		app.run();

		expect(app.components.MyComponent[0].id).to.equal('foo');

		done();
	});

	it('should provide a chainable API', done => {
		const app = assembler();

		function MyComponent() {
			this.id = 'foo';
		}

		expect(app.register(MyComponent).constructor.name).to.equal('Assembler');
		expect(app.registerAll({AnotherComponent: MyComponent}).constructor.name).to.equal('Assembler');

		done();
	});
});
