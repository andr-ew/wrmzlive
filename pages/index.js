import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { css } from '@emotion/react';
// import ReactPlayer from 'react-player/file';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import { useOBJ, useCurve, modelDefs, Model, Wrm } from '../lib/wrms.js';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

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
            <OrbitControls />
        </>
    );
};

const Spin = () => {
    const fruitsOBJProps = useOBJ(modelDefs['fruits']);
    const fruitsRef = useRef();

    useFrame((_, delta) => (fruitsRef.current.rotation.y += delta));

    return (
        <>
            <Model
                ref={fruitsRef}
                modelDef={modelDefs['fruits']}
                {...fruitsOBJProps}
            />
            <OrbitControls />
        </>
    );
};

export default function Home() {
    return (
        <>
            <div
                css={css`
                    position: absolute;
                    width: 100vw;
                    height: 100vh;
                `}
            >
                <ReactPlayer
                    url='/video/concentrics.webm'
                    loop={true}
                    muted={true}
                    playing={true}
                    width='100%'
                    height='100%'
                />
            </div>
            <Canvas
                css={css`
                    position: absolute !important;
                    width: 100vw !important;
                    height: 100vh !important;

                    canvas {
                        width: 100% !important;
                        height: 100% !important;
                    }
                `}
                camera={{ position: [0, 0, 300] }}
            >
                <Spin />
                {/* <Crv7 /> */}
            </Canvas>
        </>
    );
}

export const getStaticProps = async () => {
    return {
        props: {},
    };
};
