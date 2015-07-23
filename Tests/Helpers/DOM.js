/* @reduct/assembler x.x.x | @license MIT */

import jsdom from 'jsdom';

let mock = '<html><head></head><body></body></html>';

export default {
    defaultMock: mock,

    create (mock, callback) {
        jsdom.env(mock, {
            done (err, window) {
                global.window = window;
                global.document = window.document;

                callback();
            }
        });
    }
};
