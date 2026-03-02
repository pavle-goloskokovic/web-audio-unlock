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
export { webAudioUnlock as default };
