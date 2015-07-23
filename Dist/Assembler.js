/* @reduct/assembler x.x.x | @license MIT */

/**
 * DRAFT
 *
 * let app = assembler();
 *
 * app.register(MyComponent);
 * app.register(YetAnotherComponent)
 *
 * app.boot();
 *
 *
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Assembler = (function () {
    function Assembler() {
        _classCallCheck(this, Assembler);

        this.marker = 'component';
        this.selector = '[data-' + this.marker + ']';

        this.index = {};
        this.components = {};
    }

    _createClass(Assembler, [{
        key: 'instantiate',
        value: function instantiate(element) {
            var name = element.dataset[this.marker];

            var components = this.components[name] = [].prototype.splice(this.components[name] || []);
            var Component = this.index[name];

            components.unshift(new Component(element));
        }
    }, {
        key: 'register',
        value: function register(ComponentClass) {
            var type = typeof ComponentClass;

            if ('function' !== type) {
                throw new Error('\'' + type + '\' is not a valid component class.');
            }

            var name = ComponentClass.name;

            this.index[name] = ComponentClass;
        }
    }, {
        key: 'run',
        value: function run() {
            var _this = this;

            var elements = [].prototype.slice(document.querySelectorAll(this.selector));
            var names = Object.keys(this.index);

            //
            // Find all elements which are instantiable.
            //
            elements.filter(function (element) {
                return !! ~names.indexOf(element.dataset[_this.marker]);
            }).forEach(function (element) {
                return _this.instantiate(element);
            });
        }
    }]);

    return Assembler;
})();

exports['default'] = function () {
    var assembler = new Assembler();

    var api = {
        register: function register(ComponentClass) {
            return assembler.register(ComponentClass);
        },
        boot: function boot() {
            return assembler.boot();
        }
    };

    return api;
};

module.exports = exports['default'];
