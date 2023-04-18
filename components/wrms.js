import { useState, useRef, Suspense } from 'react';

import { css } from '@emotion/react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
2;
import { OrbitControls } from '@react-three/drei';

import {
    GamepadButton,
    GamepadAxis,
    buttonIndices,
    axisIndices,
} from '../lib/gamepad.js';
import {
    useOBJ,
    useCurve,
    modelDefs,
    Model,
    Wrm,
    curveDefs,
} from '../lib/wrms.js';

const Crv7 = () => {
    const fruitsOBJProps = useOBJ(modelDefs['fruits']);
    const curve = useCurve((t, optionalTarget) => {
        var point = optionalTarget || new THREE.Vector3();

        t *= Math.PI * 2;

        const x = (2 + Math.cos(3 * t)) * Math.cos(2 * t);
        const y = (2 + Math.cos(3 * t)) * Math.sin(2 * t);
        const z = Math.sin(3 * t) * 2;

        return point.set(x, y, z).multiplyScalar(60);
    });
    const wrmRef = useRef();

    useFrame((_, delta) => {
        const wrm = wrmRef.current;

        wrm.rotation.y += delta / 2;
        wrm.rotation.x += delta / 2;
    });

    return (
        <>
            <Wrm
                ref={wrmRef}
                {...fruitsOBJProps}
                modelDef={modelDefs['fruits']}
                curve={curve}
                segCount={75}
                duration={25 / 2}
            />
        </>
    );
};

export const WrmScene = ({
    focus,
    modelNames,
    initialNameIndex = 0,
    initialCurveIndex = 0,
}) => {
    const [nameIndex, setNameIndex] = useState(initialNameIndex);
    const [curveIndex, setCurveIndex] = useState(initialCurveIndex);

    const { wrm, scale, segCount, duration, getPoint, rotation } = curveDefs[
        curveIndex
    ];

    const curve = useCurve(getPoint);

    const OBJProps = useOBJ({ name: modelNames[nameIndex] });
    const wrmRef = useRef();

    useFrame((_, delta) => (wrmRef.current.rotation.y += delta));

    return (
        <>
            {focus && (
                <>
                    <GamepadButton
                        buttonIndex={buttonIndices.right}
                        onButtonDown={() => {
                            setNameIndex(
                                nameIndex == modelNames.length - 1
                                    ? 0
                                    : nameIndex + 1
                            );
                            console.log({
                                nameIndex,
                                name: modelNames[nameIndex],
                            });
                        }}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.left}
                        onButtonDown={() => {
                            setNameIndex(
                                nameIndex == 0
                                    ? modelNames.length - 1
                                    : nameIndex - 1
                            );
                            console.log({
                                nameIndex,
                                name: modelNames[nameIndex],
                            });
                        }}
                    />
                    {/* TODO: up & down for setCurveIndex */}
                    {/* TODO: axes set wrm rotation speeds */}
                </>
            )}
            {wrm ? (
                <Wrm
                    ref={wrmRef}
                    modelDef={modelDefs[modelNames[nameIndex]]}
                    {...OBJProps}
                    {...{ curve, segCount, duration, rotation }}
                />
            ) : (
                <Model
                    ref={wrmRef}
                    modelDef={modelDefs[modelNames[nameIndex]]}
                    {...OBJProps}
                    scale={[scale ?? 1, scale ?? 1, scale ?? 1]}
                />
            )}
            <OrbitControls />
        </>
    );
};

export const WrmLayer = ({
    focusButton,
    modelNames,
    initialNameIndex = 0,
    initialShow = true,
    initialCurveIndex = 0,
}) => {
    const [focusButtonDown, setFocusButtonDown] = useState(Date.now());
    const [focus, setFocus] = useState(false);
    const [show, setShow] = useState(initialShow);

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
            {/* TODO: axes set camera rotation speeds */}
            {/* TODO: camera zoom (a & x ?) */}
            <div
                css={css`
                    position: absolute;
                    width: 100vw;
                    height: 100vh;
                `}
                style={{
                    display: show ? 'unset' : 'none',
                }}
            >
                <Canvas
                    css={css`
                        width: 100% !important;
                        height: 100% !important;

                        canvas {
                            width: 100% !important;
                            height: 100% !important;
                        }
                    `}
                    camera={{ position: [0, 0, 300] }}
                >
                    <Suspense fallback={null}>
                        <WrmScene
                            {...{
                                focus,
                                modelNames,
                                initialNameIndex,
                                initialCurveIndex,
                            }}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </>
    );
};
