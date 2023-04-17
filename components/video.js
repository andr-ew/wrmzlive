import { useState } from 'react';

import dynamic from 'next/dynamic';

import { css } from '@emotion/react';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

import {
    GamepadButton,
    GamepadAxis,
    buttonIndices,
    axisIndices,
} from '../lib/gamepad.js';

const rateSens = 1 / 8;
const paddingSens = 1;

export const VideoLayer = ({
    focusButton,
    videoPaths,
    initialPadding = 0,
    initialPathIndex = 0,
    initialShow = true,
}) => {
    const [focusButtonDown, setFocusButtonDown] = useState(Date.now());
    const [focus, setFocus] = useState(false);

    const [show, setShow] = useState(initialShow);
    const [rate, setRate] = useState(0);
    const [pathIndex, setPathIndex] = useState(initialPathIndex);
    const [padding, setPadding] = useState(initialPadding);

    return (
        <>
            <GamepadButton
                buttonIndex={focusButton}
                onButtonDown={() => {
                    setFocusButtonDown(Date.now());
                    setFocus(true);
                }}
                onButtonUp={() => {
                    setFocus(false);

                    const heldTime = Date.now() - focusButtonDown;
                    if (heldTime < 500) setShow(!show);
                }}
            />
            {focus && (
                <>
                    <GamepadAxis
                        axisIndex={axisIndices.lx}
                        onChange={v => {
                            setRate(rate + v * rateSens);
                        }}
                    />
                    <GamepadAxis
                        axisIndex={axisIndices.ry}
                        onChange={v => {
                            setPadding(Math.max(padding + v * paddingSens, 0));
                            console.log({ padding });
                        }}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.right}
                        onButtonDown={() => {
                            setPathIndex(
                                pathIndex == videoPaths.length - 1
                                    ? 0
                                    : pathIndex + 1
                            );
                            console.log({ pathIndex });
                        }}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.left}
                        onButtonDown={() => {
                            setPathIndex(
                                pathIndex == 0
                                    ? videoPaths.length - 1
                                    : pathIndex - 1
                            );
                            console.log({ pathIndex });
                        }}
                    />
                </>
            )}
            <div
                css={css`
                    position: absolute;
                    width: 100vw;
                    height: 100vh;
                `}
                style={{
                    display: show ? 'unset' : 'none',
                    padding: `${padding / 2}vw ${padding}vw`,
                }}
            >
                <ReactPlayer
                    url={`/video/${videoPaths[pathIndex]}`}
                    loop={true}
                    muted={true}
                    playing={true}
                    width='100%'
                    height='100%'
                    playbackRate={Math.pow(2, rate)}
                />
            </div>
        </>
    );
};
