'use strict';

exports.delayedPromise = function (retVal, delay) {
    return new Promise(r => setTimeout(r, delay)).then(() => retVal);
}