"use strict";
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = function __export(target, all) {
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = function __copyProps(to, from, except, desc) {
    if (from && (typeof from === "undefined" ? "undefined" : _type_of(from)) === "object" || typeof from === "function") {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var key = _step.value;
                if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                    get: function get() {
                        return from[key];
                    },
                    enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                });
            };
            for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return to;
};
var __toCommonJS = function __toCommonJS(mod) {
    return __copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
};
// src/index.ts
var index_exports = {};
__export(index_exports, {
    default: function _default() {
        return webAudioUnlock;
    }
});
module.exports = __toCommonJS(index_exports);
var USER_INPUT_EVENTS = [
    "pointerdown",
    "pointerup",
    "touchstart",
    "touchend",
    "mousedown",
    "mouseup",
    "click",
    "keydown"
];
var LISTENER_OPTIONS = {
    capture: true,
    passive: true
};
function isValidAudioContext(context) {
    return !!context && typeof context.resume === "function" && typeof context.createBufferSource === "function" && typeof context.state === "string";
}
function createUnlockSound(context) {
    var source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 1, 22050);
    source.connect(context.destination);
    source.onended = function() {
        source.disconnect();
    };
    if (typeof source.start === "function") {
        source.start(0);
    } else if (typeof source.noteOn === "function") {
        source.noteOn(0);
    }
}
function webAudioUnlock(context) {
    return new Promise(function(resolve, reject) {
        if (!context || !isValidAudioContext(context)) {
            reject(new Error("webAudioUnlock: invalid AudioContext"));
            return;
        }
        if (context.state === "running") {
            resolve(false);
            return;
        }
        var toggleListeners = function toggleListeners(operation) {
            var method = operation + "EventListener";
            for(var i = 0; i < USER_INPUT_EVENTS.length; i++){
                document[method](USER_INPUT_EVENTS[i], unlock, LISTENER_OPTIONS);
            }
        };
        var isUnlocking = false;
        var unlock = function unlock() {
            if (isUnlocking) {
                return;
            }
            isUnlocking = true;
            createUnlockSound(context);
            context.resume().then(function() {
                if (context.state === "running") {
                    toggleListeners("remove");
                    resolve(true);
                    return;
                }
                isUnlocking = false;
            }).catch(function() {
                isUnlocking = false;
            });
        };
        toggleListeners("add");
    });
}
