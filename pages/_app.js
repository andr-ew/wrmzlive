import { Global, css } from '@emotion/react';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Global
                styles={css`
                    * {
                        box-sizing: border-box;
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
            <Component {...pageProps} />
        </>
    );
}
