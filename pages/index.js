import { readdir } from 'node:fs/promises';
import { extname, basename } from 'node:path';

import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { css } from '@emotion/react';

import { buttonIndices } from '../lib/gamepad.js';
import { VideoLayer } from '../components/video.js';
import { WrmLayer } from '../components/wrms.js';

export default function Home({ videoPaths, modelNames, imagePaths }) {
    modelNames.forEach(name => {
        useLoader.preload(OBJLoader, './mod/' + name + '.obj');
    });

    console.log({ imagePaths });

    return (
        <>
            <VideoLayer
                focusButton={buttonIndices.zl}
                videoPaths={videoPaths}
                initialPathIndex={Math.floor(Math.random() * videoPaths.length)}
                initialRate={-1}
            />
            <WrmLayer
                focusButton={buttonIndices.zr}
                modelNames={modelNames}
                imagePaths={imagePaths}
                skyBox={true}
                initialShow={false}
                initialNameIndex={Math.floor(Math.random() * modelNames.length)}
                initialCurveIndex={0}
                initialImageIndex={Math.floor(
                    Math.random() * imagePaths.length
                )}
            />
            <VideoLayer
                focusButton={buttonIndices.l}
                videoPaths={videoPaths}
                initialPadding={100 / 4}
                initialPathIndex={Math.floor(Math.random() * videoPaths.length)}
                initialRate={-0.5}
            />
            <WrmLayer
                focusButton={buttonIndices.r}
                modelNames={modelNames}
                imagePaths={imagePaths}
                skyBox={false}
                initialNameIndex={Math.floor(Math.random() * modelNames.length)}
                initialCurveIndex={0}
            />
        </>
    );
}

export const getStaticProps = async () => {
    const allVideoPaths = await readdir('./public/video');
    const allModelPaths = await readdir('./public/mod');
    const allImagePaths = await readdir('./public/img');

    const videoPaths = [];
    allVideoPaths.forEach(path => {
        if (extname(path) == '.webm') videoPaths.push(path);
    });

    const imagePaths = [];
    allImagePaths.forEach(path => {
        const ext = extname(path).toLowerCase();
        if (ext == '.png' || ext == '.jpg' || ext == '.jpeg')
            imagePaths.push(path);
    });

    const modelNames = [];
    allModelPaths.forEach(path => {
        if (extname(path) == '.obj') modelNames.push(basename(path, '.obj'));
    });

    return {
        props: { videoPaths, modelNames, imagePaths },
    };
};
