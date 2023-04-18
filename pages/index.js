import { readdir } from 'node:fs/promises';
import { extname, basename } from 'node:path';

import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { css } from '@emotion/react';

import { buttonIndices } from '../lib/gamepad.js';
import { VideoLayer } from '../components/video.js';
import { WrmLayer } from '../components/wrms.js';

export default function Home({ videoPaths, modelNames }) {
    modelNames.forEach(name => {
        useLoader.preload(OBJLoader, './mod/' + name + '.obj');
    });

    return (
        <>
            <VideoLayer
                focusButton={buttonIndices.zl}
                videoPaths={videoPaths}
                initialPathIndex={Math.floor(Math.random() * videoPaths.length)}
            />
            <VideoLayer
                focusButton={buttonIndices.l}
                videoPaths={videoPaths}
                initialPadding={100 / 4}
                initialPathIndex={Math.floor(Math.random() * videoPaths.length)}
            />
            <WrmLayer
                focusButton={buttonIndices.r}
                modelNames={modelNames}
                initialNameIndex={Math.floor(Math.random() * modelNames.length)}
            />
        </>
    );
}

export const getStaticProps = async () => {
    const allVideoPaths = await readdir('./public/video');
    const allModelPaths = await readdir('./public/mod');

    const videoPaths = [];
    allVideoPaths.forEach(path => {
        if (extname(path) == '.webm') videoPaths.push(path);
    });

    const modelNames = [];
    allModelPaths.forEach(path => {
        if (extname(path) == '.obj') modelNames.push(basename(path, '.obj'));
    });

    return {
        props: { videoPaths, modelNames },
    };
};
