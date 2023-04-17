import { useMemo, useRef, useEffect, forwardRef } from 'react';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

export const useOBJ = ({ name, texturePath }) => {
    const obj = useLoader(OBJLoader, './mod/' + name + '.obj');
    const texture = useTexture(texturePath || 'mod/' + name + '.bmp');
    const geometry = useMemo(() => {
        let g;
        obj.traverse(c => {
            if (c.type === 'Mesh') {
                g = c.geometry;
            }
        });
        return g;
    }, [obj]);

    return { geometry, texture };
};

export const modelDefs = {};

modelDefs['fruits'] = {
    name: 'fruits',
    mesh: {
        position: { z: -590, y: -120, x: 30 },
    },
    group: {
        transform: o => {
            o.rotateY(Math.PI / 8);
            o.rotateX(((Math.PI * 1) / 4) * 0.75);
            o.rotateZ(-Math.PI * 0.04);

            o.scale.set(0.5, 0.5, 0.5);
        },
    },
};

export const Model = forwardRef(function Model(
    { geometry, texture, modelDef },
    ref
) {
    const transformGroupRef = useRef();
    const meshRef = useRef();

    useEffect(() => {
        if (modelDef?.mesh?.transform) modelDef.mesh.transform(meshRef.current);
        if (modelDef?.group?.transform)
            modelDef.group.transform(transformGroupRef.current);
    }, []);

    return (
        <group ref={ref}>
            <group ref={transformGroupRef}>
                <mesh
                    ref={meshRef}
                    geometry={geometry}
                    position-x={modelDef?.mesh?.position?.x}
                    position-y={modelDef?.mesh?.position?.y}
                    position-z={modelDef?.mesh?.position?.z}
                >
                    <meshBasicMaterial map={texture} />
                </mesh>
            </group>
        </group>
    );
});

export const useCurve = getPoint =>
    useMemo(() => {
        let crv = new THREE.Curve();
        crv.getPoint = getPoint;

        // let cmat = new THREE.MeshBasicMaterial();
        // let cmsh = new THREE.Mesh( crv, cmat );

        return new THREE.TubeGeometry(crv, 100, 1, 3, true);
    }, [getPoint]);

export const Wrm = forwardRef(function Wrm(
    {
        geometry,
        texture,
        modelDef,
        curve,
        segCount,
        duration = 1,
        rotation = t => ({ x: -Math.PI / 2 }),
    },
    ref
) {
    const groupRefs = useRef([]);
    const modelRefs = useRef([]);

    let direction = new THREE.Vector3();
    let binormal = new THREE.Vector3();
    let normal = new THREE.Vector3();
    let position = new THREE.Vector3();
    let lookAt = new THREE.Vector3();

    useFrame(({ clock }) => {
        const elapsed = clock.getElapsedTime();
        const T = (elapsed % duration) / duration;
        const segments = modelRefs.current;
        const groups = groupRefs.current;
        const crv = curve;

        for (let i in segments) {
            let seg = segments[i];
            let t = (T + i / segCount) % 1;

            const rot = rotation(t);
            for (const ax in rot) groups[i].rotation[ax] = rot[ax];

            crv.parameters.path.getPointAt(t, position);
            position.multiplyScalar(1);

            // interpolation

            var tangents = crv.tangents.length;
            var pickt = t * tangents;
            var pick = Math.floor(pickt);
            var pickNext = (pick + 1) % tangents;

            binormal.subVectors(crv.binormals[pickNext], crv.binormals[pick]);
            binormal.multiplyScalar(pickt - pick).add(crv.binormals[pick]);

            crv.parameters.path.getTangentAt(t, direction);
            var offset = 15;

            normal.copy(binormal).cross(direction);

            // we move on a offset on its binormal

            position.add(normal.clone().multiplyScalar(offset));

            seg.position.copy(position);

            // using arclength for stablization in look ahead

            crv.parameters.path.getPointAt(
                (t + 30 / crv.parameters.path.getLength()) % 1,
                lookAt
            );
            lookAt.multiplyScalar(1);

            // camera orientation 2 - up orientation via normal

            if (!true) lookAt.copy(position).add(direction);
            seg.matrix.lookAt(seg.position, lookAt, normal);
            seg.quaternion.setFromRotationMatrix(seg.matrix);
        }
    });

    return (
        <group ref={ref}>
            {Array(segCount)
                .fill()
                .map((_, i) => (
                    <group key={i} ref={o => (groupRefs.current[i] = o)}>
                        <Model
                            ref={o => (modelRefs.current[i] = o)}
                            {...{ modelDef, geometry, texture }}
                        />
                    </group>
                ))}
        </group>
    );
});
