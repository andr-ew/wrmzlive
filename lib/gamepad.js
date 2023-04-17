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
