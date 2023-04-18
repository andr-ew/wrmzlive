import { useMemo, useRef, useEffect, forwardRef } from 'react';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

export const modelDefs = {};

modelDefs['reset'] = {
    name: 'reset',
    mesh: {
        transform: o => {
            o.rotation.set(0, 0, 0);
            o.scale.set(1, 1, 1);
        },
    },
    group: {
        transform: o => {
            o.rotation.set(0, 0, 0);
            o.scale.set(1, 1, 1);
        },
    },
};

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

modelDefs['teapot3'] = {
    name: 'teapot3',
    mesh: {
        position: { y: -50 * 0.25 },
        transform: mesh => {
            mesh.scale.set(0.25, 0.25, 0.25);
            mesh.rotateX(-Math.PI / 2);
        },
    },
};

modelDefs['boquet'] = {
    name: 'boquet',
    mesh: {
        position: { z: -270, y: 50 },
        transform: mesh => {
            mesh.scale.set(0.5, 0.5, 0.5);
            mesh.rotateX(Math.PI / 8);
        },
    },
};

modelDefs['tea'] = {
    name: 'tea',
    mesh: {
        position: { z: -270, y: 75, x: 10 },
        transform: mesh => {
            mesh.scale.set(0.5, 0.5, 0.5);
            mesh.rotateX((Math.PI / 8) * 1.4);
            mesh.rotateZ(-Math.PI * 0.037);
        },
    },
};

modelDefs['flower'] = {
    name: 'flower',
    mesh: {
        position: { z: -600, y: -140 },
    },
    group: {
        transform: g => {
            g.rotateY(((Math.PI * 1) / 2) * 0.9);
            g.rotateX(((Math.PI * 1) / 4) * 0.8);
            g.rotateZ(-Math.PI * 0.005);

            g.scale.set(0.5, 0.5, 0.5);
        },
    },
};

export const useOBJ = ({ name, texturePath }) => {
    const obj = useLoader(OBJLoader, './mod/' + name + '.obj');
    const texture = useTexture(texturePath || 'mod/' + name + '.bmp');
    const geometry = useMemo(() => {
        console.log('load');

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

export const Model = forwardRef(function Model(
    { geometry, texture, modelDef },
    ref
) {
    const transformGroupRef = useRef();
    const meshRef = useRef();

    useEffect(() => {
        const mesh = meshRef.current;
        const group = transformGroupRef.current;

        console.log('transform', { mesh });

        if (modelDef?.mesh?.transform) modelDef.mesh.transform(mesh);
        if (modelDef?.group?.transform) modelDef.group.transform(group);

        return () => {
            console.log('reset', { mesh });
            modelDefs.reset.mesh.transform(mesh);
            modelDefs.reset.group.transform(group);
        };
    }, [modelDef]);

    return (
        <group ref={ref}>
            <group ref={transformGroupRef}>
                <mesh
                    ref={meshRef}
                    geometry={geometry}
                    position-x={modelDef?.mesh?.position?.x ?? 0}
                    position-y={modelDef?.mesh?.position?.y ?? 0}
                    position-z={modelDef?.mesh?.position?.z ?? 0}
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
