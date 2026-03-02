const USER_INPUT_EVENTS = [
    'pointerdown',
    'pointerup',
    'touchstart',
    'touchend',
    'mousedown',
    'mouseup',
    'click',
    'keydown',
];

const LISTENER_OPTIONS = { capture: true, passive: true };

function isValidAudioContext (context: AudioContext): boolean
{
    const AudioContextConstructor = window.AudioContext || (<any>window).webkitAudioContext;
    return !!AudioContextConstructor && context instanceof AudioContextConstructor;
}

function createUnlockSound (context: AudioContext): void
{
    const source = context.createBufferSource();

    source.buffer = context.createBuffer(1, 1, 22050);
    source.connect(context.destination);
    source.onended = () =>
    {
        source.disconnect();
    };

    if (typeof source.start === 'function')
    {
        source.start(0);
    }
    else if (typeof (<any>source).noteOn === 'function')
    {
        (<any>source).noteOn(0);
    }
}

export default function webAudioUnlock (context: AudioContext)
{
    return new Promise <boolean>((resolve, reject) =>
    {
        if (!context || !isValidAudioContext(context))
        {
            reject(new Error('webAudioUnlock: You need to pass an instance of AudioContext to this method call'));
            return;
        }

        if (context.state === 'running')
        {
            resolve(false);

            return;
        }

        const toggleListeners = (operation: 'add' | 'remove') =>
        {
            const method = operation + 'EventListener' as
                'addEventListener' | 'removeEventListener';

            for (const eventName of USER_INPUT_EVENTS)
            {
                document[method](eventName, unlock, LISTENER_OPTIONS);
            }
        };

        let isUnlocking = false;

        const unlock = () =>
        {
            if (isUnlocking)
            {
                return;
            }
            isUnlocking = true;

            createUnlockSound(context);

            context.resume().then(() =>
            {
                if (context.state === 'running')
                {
                    toggleListeners('remove');

                    resolve(true);

                    return;
                }

                isUnlocking = false;
            }
            ).catch(() =>
            {
                isUnlocking = false;
            });
        };

        toggleListeners('add');
    });
}
