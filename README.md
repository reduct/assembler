# ComponentDomParser [![Dependency Status](https://david-dm.org/Inkdpixels/ComponentDomParser.svg)](https://david-dm.org/Inkdpixels/ComponentDomParser) [![devDependency Status](https://david-dm.org/Inkdpixels/ComponentDomParser/dev-status.svg)](https://david-dm.org/Inkdpixels/ComponentDomParser#info=devDependencies) [![Build Status](https://travis-ci.org/Inkdpixels/ComponentDomParser.png?branch=master)](https://travis-ci.org/Inkdpixels/ComponentDomParser) [![Code Climate](https://codeclimate.com/github/Inkdpixels/ComponentDomParser/badges/gpa.svg)](https://codeclimate.com/github/Inkdpixels/ComponentDomParser) [![Test Coverage](https://codeclimate.com/github/Inkdpixels/ComponentDomParser/badges/coverage.svg)](https://codeclimate.com/github/Inkdpixels/ComponentDomParser)

> Parses a DOM Node for tags and executes the matching Constructor on each element.

## Install
With npm, use the familiar syntax e.g.:
```shell
npm install ComponentDomParser --save
```

once the WebfontJSON package is installed, just require it in the main application file.
```js
var ComponentDomParser = require("ComponentDomParser");
```

This package also supports AMD/RequireJS, it is defined as `ComponentDomParser`. Aren't using AMD/CommonJS? Just grab a [release](https://github.com/Inkdpixels/ComponentDomParser/releases), include the `Dist/ComponentDomParser.min.js` and access the loader via the following global:
```js
var ComponentDomParser = window.ComponentDomParser;
```

### Configuration
In the main application file, create a new instance of the Constructor e.g.:
```js
// Initialize a new instance of the ComponentDomParser.
var loader = new ComponentDomParser({
  url: "fonts/webfont.json",
  timeStamp: "?t=01072015",
  JSONPCallbackName: "callbackName"
});

// Load the fonts.
loader.getWebFontStyles();
```

### Options
#### options.url
Type: `String`

The URL to the generated JSONP file.

#### options.timeStamp
Type: `String` || `Number`

A timestamp which will be saved on each device visiting the site, if the users cached version doesn't match value, the JSONP will be re-fetched and applied to the page, thus, getting the newest version of the font. It's recommended to renew the timeStamp on each re-compilation of the JSONP file.

If this option wasn't set, a new `Date` object will be used as the timeStamp, thus, the cache will be disabled.

#### options.JSONPCallbackName
Type: `String`

The JSONP callback name, filed as `callback` in the [WebfontJSON configuration](https://github.com/ahume/webfontjson#how).

#### options.fontLoadedCallback (optional)
Type: `Function`

An optional callback which get's executed once the styles are attached to the document.

#### options.namespace (optional)
Type: `String`

The namespace for the font, usefull if multiple instances of the loader are executed on a page.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
