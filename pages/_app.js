import { Global, css } from '@emotion/react';

import { GamepadProvider } from '../lib/gamepad.js';

export default function App({ Component, pageProps }) {
    return (
        <>
            {/* <GamePadEvents /> */}
            <Global
                styles={css`
                    * {
                        box-sizing: border-box;
                        // cursor: none;
                    }

                    html,
                    body {
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                    }

                    body {
                        background: #3e54d7;
                    }

                    video {
                        object-fit: cover;
                    }
                `}
            />
            <GamepadProvider>
                <Component {...pageProps} />
            </GamepadProvider>
        </>
    );
}
