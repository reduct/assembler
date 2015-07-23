# @reduct/assembler
[![Build Status](https://travis-ci.org/reduct/assembler.svg)](https://travis-ci.org/reduct/assembler) [![Dependency Status](https://david-dm.org/reduct/assembler.svg)](https://david-dm.org/reduct/assembler) [![devDependency Status](https://david-dm.org/reduct/assembler/dev-status.svg)](https://david-dm.org/reduct/assembler#info=devDependencies) [![Code Climate](https://codeclimate.com/github/reduct/assembler/badges/gpa.svg)](https://codeclimate.com/github/reduct/assembler) [![Test Coverage](https://codeclimate.com/github/reduct/assembler/badges/coverage.svg)](https://codeclimate.com/github/reduct/assembler/coverage)

> Parses a DOM Node for tags and executes the matching Constructor on each element. This module embraces the practice of a 'Single Point of Entry'-Application(SPE).


## Why?
Using a single point of entry reduces code and promotes maintainability. Instead of writing the following accross all of your sites/apps components:
```js
// An example using jQuery/Zepto.
$('.myAwesomeApp').each(function(index, node) {
	new AwesomeApp(node);
});
```

... you will just create a parser, which does all the initializing logic for you. It also reduces the number of operations in the DOM, which is great for performance since DOM operations are generally slow. Last but not least, your apps/components are free of selectors, you don't need to adjust your component if another project forbids the use of classes or a certain `data-*` attribute as a JS selector.

TL;DR: Use a parser, to reduce duplicate code, enhance performance and reduce the dependence of selectors in your JS.


## Install
With npm, use the familiar syntax e.g.:
```shell
npm install @reduct/assembler --save
```

once the Assembler package is installed, just require it in the main application file.
```js
var Assembler = require('@reduct/assembler');
```

This package also supports AMD/RequireJS, it is defined as `reductAssembler`. Aren't using AMD/CommonJS? Just grab a [release](https://github.com/reduct/assembler/releases), include the `Dist/Assembler.min.js` and access the loader via the following global:
```js
var Assembler = window.reductAssembler;
```


### Configuration
In the main application file, create a new instance of the Constructor e.g.:
```js
// Initialize a new instance of the Assembler.
var parser = new Assembler({
    dataSelector: 'app',
    componentIndex: {
        'myApplication': function(el) { el.innerHTML = 'myApplication initialized!' }
    },
    componentDidMountCallback: function(instance) {
        console.log(instance);
    }
});

// Parse the document for all [data-app] nodes.
parser.parse();
```


### Options
#### options.dataSelector
Type: `String`

The data-* selector on which the parser is based on, if your element has the attribute `data-app="myApplication"`, you should define `app` as the `dataSelector`.

#### options.componentIndex
Type: `Object`

The index of components, if the value of e.g. `data-app` isn't listed as a key in this object, the parser will throw an debug info into the windows console.
F.e. if an element with the `data-app="myApplication"` was found while the `dataSelector` was configured as `app`, you should declare the following `componentIndex`:
```js
// Define some application Constructors.
var MyApplication = function(el) {
	console.log('MyApplication initialized on: ', el);
};
var MyOtherApplication = function(el) {
	console.log('MyOtherApplication initialized on: ', el);
};

// Initialize a new instance of the Assembler.
var appIndex = {
	myApplication: MyApplication,
	myOtherApplication: MyOtherApplication
	// ... other apps
};

// Initialize a new instance of the Assembler.
var parser = new Assembler({
	dataSelector: 'app',
    componentIndex: appIndex
});

// Parse the document for all [data-app] nodes.
parser.parse();
```

#### options.componentDidMountCallback
Type: `Function`

The Callback which get's executed on each mount of a component. Useful if you want to execute custom code on each initialization of a component. This function get's called with the created instance as the first argument.

#### options.nonIndexedComponentPolicies
Type: `Object`

An optional map of matchers and functions that are executed.

Useful for asynchronous loading of Components - If the desired `componentKey` is not listed in the `componentIndex` in the moment of the `.parse()`, the matching fallback Constructor will be applied.

Keys are evaluated as wildcarded component keys, which are matched against the component key of each `HTML Element` in question.

Values are functions, taking `componentKey (String)` and `node (HTMLElement)` as an argument and should return a Component constructor like those listed in the `componentIndex`.

Example:

```js
var parser = new Assembler({
    dataSelector: 'app',
    componentIndex: {},
    nonIndexedComponentPolicies: {
			'MyNamespace/*' : function(componentKey, el) {
				return function(el) {
					el.innerHTML = '"' + componentKey + '" was loaded!';
				};
			},
			'*' : function(componentKey, el) {
				return function(el) {
					el.innerHTML = '"' + componentKey + '" not found!';
				};
			}
		}
});
```

```html
<div data-app="MyNamespace/Something"></div>
<div data-app="MyNamespace/SomethingElse"></div>
<div data-app="SomethingCompletelyDifferent"></div>
```

Considering both of the code snippets above, the execution of  `parser.parse();` would result in the following output:

```
MyNamespace/Something was loaded!
MyNamespace/SomethingElse was loaded!
SomethingCompletelyDifferent not found!
```

#### options.isLoggingEnabled
Type: `Boolean`

Enables logging messages to the UAs console object for debugging purposes.


### Methods
#### parser.parse(contextElement);
Will parse the given `contextElement`, which is optional and will fall back to the `document.body`, for matching elements and will initiate a Constructor mount.

#### parser.addComponent(componentKey, Component);
Adds the given `Component` Constructor to the internal `componentIndex`. Useful for asynchronous loaded Components.
Note that you still need to (re-)parse the node/document after adding components.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.


## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
