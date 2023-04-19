import { useState, useRef, Suspense } from 'react';

import { css } from '@emotion/react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
    useSkyBox,
} from '../lib/wrms.js';

const rateSens = 0.05;
const zoomStep = 5;
const spherical = new THREE.Spherical();

export const WrmScene = ({
    focus,
    modelNames,
    imagePaths,
    skyBox = false,
    initialNameIndex = 0,
    initialCurveIndex = 0,
    initialImageIndex = 0,
    initialRate = 0,
    initialZoom = 500,
}) => {
    const [nameIndex, setNameIndex] = useState(initialNameIndex);
    const [curveIndex, setCurveIndex] = useState(initialCurveIndex);
    const [imageIndex, setImageIndex] = useState(initialImageIndex);
    const [cameraRateX, setCameraRateX] = useState(initialRate);
    const [cameraRateY, setCameraRateY] = useState(initialRate);
    const [wrmRateX, setWrmRateX] = useState(initialRate);
    const [wrmRateY, setWrmRateY] = useState(initialRate);
    const [zoomDirection, setZoomDirection] = useState(0); //0: none, 1: out, -1: in

    const zoomRef = useRef(initialZoom);

    const {
        wrm,
        scale,
        segCount,
        duration,
        getPoint,
        rotation,
        position,
    } = curveDefs[curveIndex];

    const curve = useCurve(getPoint);

    const OBJProps = useOBJ({ name: modelNames[nameIndex] });
    const wrmRef = useRef();

    const camera = useThree(state => state.camera);

    const sphericalRef = useRef(spherical);
    const phiRef = useRef(0);

    useSkyBox(imagePaths[imageIndex], skyBox);

    useFrame((_, delta) => {
        zoomRef.current = Math.max(
            zoomRef.current + zoomDirection * zoomStep,
            1 / 1000000
        );

        if (wrm) {
            const w = wrmRef.current;
            const s = sphericalRef.current;

            w.rotation.y += delta * wrmRateX;
            w.rotation.x += delta * wrmRateY;

            s.radius = zoomRef.current;
            phiRef.current += delta * cameraRateY;
            s.phi = Math.PI / 2 - (Math.PI / 2) * Math.sin(phiRef.current);
            s.theta += delta * cameraRateX;

            s.makeSafe();

            camera.position.setFromSpherical(s);
            camera.lookAt(0, 0, 0);
        } else {
            camera.position.set(0, 0, zoomRef.current);
            wrmRef.current.rotation.x += delta * cameraRateY * 2;
            wrmRef.current.rotation.y += delta * wrmRateX * 2;
        }
    });

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
                    <GamepadButton
                        buttonIndex={buttonIndices.up}
                        onButtonDown={() => {
                            setCurveIndex(
                                curveIndex == curveDefs.length - 1
                                    ? 0
                                    : curveIndex + 1
                            );
                            console.log({
                                curveIndex,
                            });
                        }}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.down}
                        onButtonDown={() => {
                            setCurveIndex(
                                curveIndex == 0
                                    ? curveDefs.length - 1
                                    : curveIndex - 1
                            );
                            console.log({
                                curveIndex,
                            });
                        }}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.a}
                        onButtonDown={() => {
                            setImageIndex(
                                imageIndex == imagePaths.length - 1
                                    ? 0
                                    : imageIndex + 1
                            );
                            console.log({
                                imageIndex,
                                path: imagePaths[imageIndex],
                            });
                        }}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.y}
                        onButtonDown={() => {
                            setImageIndex(
                                imageIndex == 0
                                    ? imageNames.length - 1
                                    : imageIndex - 1
                            );
                            console.log({
                                imageIndex,
                                path: imagePaths[imageIndex],
                            });
                        }}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.x}
                        onButtonDown={() => setZoomDirection(-1)}
                        onButtonUp={() => setZoomDirection(0)}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.b}
                        onButtonDown={() => setZoomDirection(1)}
                        onButtonUp={() => setZoomDirection(0)}
                    />
                    <GamepadAxis
                        axisIndex={axisIndices.lx}
                        onChange={v => {
                            setWrmRateX(wrmRateX + v * rateSens);
                        }}
                    />
                    <GamepadAxis
                        axisIndex={axisIndices.ly}
                        onChange={v => {
                            setWrmRateY(wrmRateY + v * rateSens);
                        }}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.ls}
                        onButtonUp={() => {
                            setWrmRateX(0);
                            setWrmRateY(0);
                        }}
                    />
                    <GamepadAxis
                        axisIndex={axisIndices.rx}
                        onChange={v => {
                            setCameraRateX(cameraRateX + v * rateSens);
                        }}
                    />
                    <GamepadAxis
                        axisIndex={axisIndices.ry}
                        onChange={v => {
                            setCameraRateY(cameraRateY + v * rateSens);
                        }}
                    />
                    <GamepadButton
                        buttonIndex={buttonIndices.rs}
                        onButtonUp={() => {
                            setCameraRateX(0);
                            setCameraRateY(0);
                        }}
                    />
                </>
            )}
            {wrm ? (
                <Wrm
                    ref={wrmRef}
                    modelDef={modelDefs[modelNames[nameIndex]]}
                    {...OBJProps}
                    {...{ curve, segCount, duration, rotation }}
                    position-x={position?.x ?? 0}
                    position-y={position?.y ?? 0}
                    position-z={position?.z ?? 0}
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

export const WrmLayer = ({ focusButton, initialShow = true, ...props }) => {
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
                                ...props,
                            }}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </>
    );
};
