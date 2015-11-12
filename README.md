# @reduct/assembler
[![Build Status](https://travis-ci.org/reduct/assembler.svg)](https://travis-ci.org/reduct/assembler) [![Dependency Status](https://david-dm.org/reduct/assembler.svg)](https://david-dm.org/reduct/assembler) [![devDependency Status](https://david-dm.org/reduct/assembler/dev-status.svg)](https://david-dm.org/reduct/assembler#info=devDependencies) [![Code Climate](https://codeclimate.com/github/reduct/assembler/badges/gpa.svg)](https://codeclimate.com/github/reduct/assembler) [![Test Coverage](https://codeclimate.com/github/reduct/assembler/badges/coverage.svg)](https://codeclimate.com/github/reduct/assembler/coverage)

> Parses a DOM Node for tags and executes the matching constructor on each element. This module embraces the practice of a 'Single Point of Entry'-Application(SPE).


## Why?
Using a single point of entry reduces code and promotes maintainability. Instead of writing the following accross all of your sites/apps components:
```js
// An example using jQuery/Zepto.
$('.myAwesomeApp').each(function(index, node) {
	new AwesomeApp(node);
});
```

... you will just create an assembler, which does all the initializing logic for you. It also reduces the number of operations in the DOM, which is great for performance since DOM operations are generally slow. Last but not least, your apps/components are free of selectors, you don't need to adjust your component if another project forbids the use of classes or a certain `data-*` attribute as a JS selector.

TL;DR: Use an assembler, to reduce duplicate code, enhance performance and reduce the dependence of selectors in your JS.


## Install
With npm, use the familiar syntax e.g.:
```shell
npm install @reduct/assembler --save
```

once the Assembler package is installed, just require it in the main application file.
```js
var assembler = require('@reduct/assembler');
```

This package also supports AMD/RequireJS. Aren't using AMD or CommonJS? Access the assembler via the following global:
```js
var assembler = window.reduct.assembler;
```

### Configuration
In the main application file, create a new instance of the Constructor e.g.:

```js
import assembler from '@reduct/assembler';
import MyComponent from 'MyComponent';
import YetAnotherComponent from 'YetAnotherComponent';

let app = assembler();

app.register(MyComponent);
app.register(YetAnotherComponent)

app.run();
```

In your HTML:

```html
<div data-component="MyComponent"></div>
<div data-component="YetAnotherComponent"></div>
```


## API

### Factory

The factory creates a new instance of the assembler, called `app`.

```js
import assembler from 'assembler';

let app = assembler();
```

### register(Class[, name])

Registers a given component. You can define an optional name in order to overwrite the component's name.

```js
import MyComponent from 'my-component';
import AnotherComponent from 'another-component';

app.register(MyComponent);
app.register(AnotherComponent, 'FooComponent');
```

Your HTML would look like

```html
<div data-component="MyComponent"></div>
<div data-component="FooComponent"></div>
```

### registerAll(classMap)

Registers a bunch of components at once.

```js
import MyComponent from 'my-component';
import AnotherComponent from 'another-component';

app.registerAll({
    MyComponent: MyComponent,
    FooComponent: AnotherComponent
});
```

The corresponding HTML:

```html
<div data-component="MyComponent"></div>
<div data-component="FooComponent"></div>
```

You can shorten this statement if you're using ES2015 and do not want to rename the component classes:

```js
import MyComponent from 'my-component';
import AnotherComponent from 'another-component';

app.registerAll({MyComponent, AnotherComponent});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Regarding the commit messages, please use a prefix listed at [Inkdpixels/commit-analyzer](https://github.com/Inkdpixels/commit-analyzer#commit-message-guidelines) so semantic-release can do it's ob properly.


## License
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
