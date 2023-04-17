import { createContext, useContext, useRef, useState, useEffect } from 'react';

import { GamepadListener } from 'gamepad.js';

const GamepadContext = createContext({
    listener: null,
});

export const GamepadProvider = ({ children }) => {
    const [listener, setListener] = useState(null);

    useEffect(() => {
        const l = new GamepadListener();
        l.start();

        l.on('gamepad:connected', event => {
            console.log('connected', event);
        });

        setListener(l);

        return () => {
            l.stop();
        };
    }, []);

    return (
        <GamepadContext.Provider value={{ listener }}>
            {children}
        </GamepadContext.Provider>
    );
};

export const useGamepad = () => {
    const { listener } = useContext(GamepadContext);

    return {
        listener,
    };
};

export const buttonIndices = {
    b: 0,
    a: 1,
    y: 2,
    x: 3,
    l: 4,
    r: 5,
    zl: 6,
    zr: 7,
    ['-']: 8,
    ['+']: 9,
    ls: 10,
    rs: 11,
    up: 12,
    down: 13,
    left: 14,
    right: 15,
};

export const axisIndices = {
    lx: 0,
    ly: 1,
    rx: 2,
    ry: 3,
};

export const GamepadButton = ({
    buttonIndex,
    onButtonDown = () => {},
    onButtonUp = () => {},
}) => {
    const { listener } = useGamepad();

    useEffect(() => {
        const handler = event => {
            const {
                button, // Button index: Number [0-N].
                pressed, // Native GamepadButton pressed value: Boolean.
            } = event.detail;

            if (button == buttonIndex) {
                if (pressed) {
                    onButtonDown();
                } else {
                    onButtonUp();
                }
            }
        };

        if (listener) listener.on(`gamepad:button`, handler);

        return () => {
            if (listener) listener.off(`gamepad:button`, handler);
        };
    }, [listener, buttonIndex, onButtonDown, onButtonUp]);

    return <></>;
};

export const GamepadAxis = ({ axisIndex, onChange = () => {} }) => {
    const { listener } = useGamepad();

    useEffect(() => {
        const handler = event => {
            const {
                axis, // Axis index: Number [0-N].
                value, // Current value: Number between 0 and 1. Float in analog mode, integer otherwise.
            } = event.detail;

            if (axis == axisIndex) {
                onChange(value);
            }
        };

        if (listener) listener.on(`gamepad:axis`, handler);

        return () => {
            if (listener) listener.off(`gamepad:axis`, handler);
        };
    }, [listener, axisIndex, onChange]);

    return <></>;
};
