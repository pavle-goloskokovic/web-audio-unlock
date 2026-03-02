function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
// src/index.ts
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
    var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    return !!AudioContextConstructor && _instanceof(context, AudioContextConstructor);
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
            reject(new Error("webAudioUnlock: You need to pass an instance of AudioContext to this method call"));
            return;
        }
        if (context.state === "running") {
            resolve(false);
            return;
        }
        var toggleListeners = function toggleListeners(operation) {
            var method = operation + "EventListener";
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = USER_INPUT_EVENTS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var eventName = _step.value;
                    document[method](eventName, unlock, LISTENER_OPTIONS);
                }
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
export { webAudioUnlock as default };
