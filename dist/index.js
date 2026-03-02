"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = webAudioUnlock;
var USER_INPUT_EVENTS = [
    'pointerdown',
    'pointerup',
    'touchstart',
    'touchend',
    'mousedown',
    'mouseup',
    'click',
    'keydown',
];
var LISTENER_OPTIONS = { capture: true, passive: true };
function isValidAudioContext(context) {
    var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    return !!AudioContextConstructor && context instanceof AudioContextConstructor;
}
function createUnlockSound(context) {
    var source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 1, 22050);
    source.connect(context.destination);
    source.onended = function () {
        source.disconnect();
    };
    if (typeof source.start === 'function') {
        source.start(0);
    }
    else if (typeof source.noteOn === 'function') {
        source.noteOn(0);
    }
}
function webAudioUnlock(context) {
    return new Promise(function (resolve, reject) {
        if (!context || !isValidAudioContext(context)) {
            reject(new Error('webAudioUnlock: You need to pass an instance of AudioContext to this method call'));
            return;
        }
        if (context.state === 'running') {
            resolve(false);
            return;
        }
        var toggleListeners = function (operation) {
            var method = operation + 'EventListener';
            for (var _i = 0, USER_INPUT_EVENTS_1 = USER_INPUT_EVENTS; _i < USER_INPUT_EVENTS_1.length; _i++) {
                var eventName = USER_INPUT_EVENTS_1[_i];
                document[method](eventName, unlock, LISTENER_OPTIONS);
            }
        };
        var isUnlocking = false;
        var unlock = function () {
            if (isUnlocking) {
                return;
            }
            isUnlocking = true;
            createUnlockSound(context);
            context.resume().then(function () {
                if (context.state === 'running') {
                    toggleListeners('remove');
                    resolve(true);
                    return;
                }
                isUnlocking = false;
            }).catch(function () {
                isUnlocking = false;
            });
        };
        toggleListeners('add');
    });
}
