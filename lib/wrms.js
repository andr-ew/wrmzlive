import { useMemo, useRef, useEffect, forwardRef } from 'react';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
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
            mesh.scale.set(0.5, 0.5, 0.5);
            // mesh.rotateX(-Math.PI / 2);
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

export const curveDefs = [];

curveDefs[0] = {
    wrm: false,
    scale: 3,
};

curveDefs[1] = {
    wrm: true,
    segCount: 40,
    duration: 17 / 2,
    position: { y: -80 },
    getPoint: (t, optionalTarget) => {
        var point = optionalTarget || new THREE.Vector3();

        t *= 2 * Math.PI;

        var R = 20;
        var s = 50;

        var sz = 3.5;

        var x = s * Math.sin(1 * t);
        var y = Math.cos(t) * (R + s * Math.cos(t));
        var z = Math.sin(t) * (R + s * Math.cos(t));

        return point.set(x * sz, y * sz, z * sz);
    },
};

curveDefs[2] = {
    wrm: true,
    duration: 25 / 2,
    segCount: 70,
    getPoint: (t, optionalTarget) => {
        var point = optionalTarget || new THREE.Vector3();

        t *= 2 * Math.PI;

        var R = 20;
        var s = 50;

        var sz = 3.5;

        var x = s * Math.sin(2 * t);
        var y = Math.cos(t * 2) * (R + s * Math.cos(t));
        var z = Math.sin(t * 2) * (R + s * Math.cos(t));

        return point.set(x * sz, y * sz, z * sz);
    },
    rotation: t => ({
        x: 0,
        y: -Math.PI * Math.cos(t * Math.PI),
        z: -Math.PI / 2,
    }),
};

curveDefs[3] = {
    wrm: true,
    duration: 40 / 2,
    segCount: 130,
    getPoint: (t, optionalTarget) => {
        var point = optionalTarget || new THREE.Vector3();

        t = 2 * Math.PI * t;

        var x =
            -0.22 * Math.cos(t) -
            1.28 * Math.sin(t) -
            0.44 * Math.cos(3 * t) -
            0.78 * Math.sin(3 * t);
        var y =
            -0.1 * Math.cos(2 * t) -
            0.27 * Math.sin(2 * t) +
            0.38 * Math.cos(4 * t) +
            0.46 * Math.sin(4 * t);
        var z = 0.7 * Math.cos(3 * t) - 0.4 * Math.sin(3 * t);

        return point.set(x, y, z).multiplyScalar(200);
    },
};

curveDefs[4] = {
    wrm: true,
    duration: 25 / 2,
    segCount: 70,
    getPoint: (t, optionalTarget) => {
        var point = optionalTarget || new THREE.Vector3();

        t *= Math.PI * 2;

        const x = (2 + Math.cos(3 * t)) * Math.cos(2 * t);
        const y = (2 + Math.cos(3 * t)) * Math.sin(2 * t);
        const z = Math.sin(3 * t) * 2;

        return point.set(x, y, z).multiplyScalar(60);
    },
};

curveDefs[6] = {
    wrm: true,
    duration: 25 / 2,
    segCount: 70,
    getPoint: (t, optionalTarget) => {
        var point = optionalTarget || new THREE.Vector3();

        t *= Math.PI * 2;

        const x = (2 + Math.cos(3 * t)) * Math.cos(2 * t);
        const y = (2 + Math.cos(3 * t)) * Math.sin(2 * t);
        const z = Math.sin(3 * t);

        return point.set(x, y, z).multiplyScalar(60);
    },
};

curveDefs[7] = {
    wrm: true,
    duration: 25 / 2,
    segCount: 130,
    getPoint: (t, optionalTarget) => {
        var point = optionalTarget || new THREE.Vector3();

        t *= Math.PI * 2;

        const x = (2 + Math.cos(3 * t)) * Math.cos(2 * t);
        const y = (2 + Math.cos(3 * t)) * Math.sin(2 * t);
        const z = Math.sin(3 * t) * 2;

        return point.set(x, y, z).multiplyScalar(120);
    },
};

curveDefs[5] = {
    wrm: true,
    duration: 17 / 2,
    segCount: 40,
    getPoint: (t, optionalTarget) => {
        var point = optionalTarget || new THREE.Vector3();

        t *= 2 * Math.PI;

        // var R = 20;
        var s = 50;

        var sz = 3.5;

        //var x = s * Math.sin(1 * t);
        //var y = Math.cos(t) * (R + s * Math.cos(t));
        //var z = Math.sin(t) * (R + s * Math.cos(t));

        var x = s * Math.sin(1 * t);
        var y = s * Math.cos(1 * t);
        var z = 0; //s * Math.cos(1 * t);

        return point.set(x * sz, y * sz, z * sz);
    },
    rotation: t => ({
        x: -Math.PI / 2,
        y: Math.PI * 2 * t,
        z: (Math.PI / 2) * Math.sin(2 * Math.PI * t),
    }),
};

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

export const Model = forwardRef(function Model(
    { geometry, texture, modelDef, ...props },
    ref
) {
    const transformGroupRef = useRef();
    const meshRef = useRef();

    useEffect(() => {
        const mesh = meshRef.current;
        const group = transformGroupRef.current;

        if (modelDef?.mesh?.transform) modelDef.mesh.transform(mesh);
        if (modelDef?.group?.transform) modelDef.group.transform(group);

        return () => {
            modelDefs.reset.mesh.transform(mesh);
            modelDefs.reset.group.transform(group);
        };
    }, [modelDef]);

    return (
        <group ref={ref} {...props}>
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
        if (getPoint) {
            let crv = new THREE.Curve();
            crv.getPoint = getPoint;

            // let cmat = new THREE.MeshBasicMaterial();
            // let cmsh = new THREE.Mesh( crv, cmat );

            return new THREE.TubeGeometry(crv, 100, 1, 3, true);
        }
    }, [getPoint]);

export const useSkyBox = (imagePath, visible) => {
    const texture = useTexture('img/' + imagePath);
    const scene = useThree(state => state.scene);
    const renderer = useThree(state => state.gl);

    useEffect(() => {
        if (visible) {
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            var hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(
                texture
            );
            texture.dispose();
            pmremGenerator.dispose();

            const bg = hdrCubeRenderTarget.texture;
            scene.background = bg;
        } else {
            scene.background = null;
        }

        return () => {
            scene.background = null;
        };
    }, [imagePath, renderer, scene, texture, visible]);
};

export const Wrm = forwardRef(function Wrm(
    {
        geometry,
        texture,
        modelDef,
        curve,
        segCount,
        duration = 1,
        rotation = t => ({ x: -Math.PI / 2 }),
        ...props
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
        // const segments = modelRefs.current;
        // const groups = groupRefs.current;
        const groups = modelRefs.current;
        const segments = groupRefs.current;
        const crv = curve;

        for (let i in groups) {
            let group = groups[i];

            if (group) {
                let t = (T + i / segCount) % 1;

                const rot = rotation(t);
                for (const ax in rot) group.rotation[ax] = rot[ax];
            }
        }

        for (let i in segments) {
            let seg = segments[i];

            if (seg) {
                let t = (T + i / segCount) % 1;

                // const rot = rotation(t);
                // for (const ax in rot) groups[i].rotation[ax] = rot[ax];

                crv.parameters.path.getPointAt(t, position);
                position.multiplyScalar(1);

                // interpolation

                var tangents = crv.tangents.length;
                var pickt = t * tangents;
                var pick = Math.floor(pickt);
                var pickNext = (pick + 1) % tangents;

                binormal.subVectors(
                    crv.binormals[pickNext],
                    crv.binormals[pick]
                );
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
        }
    });

    return (
        <group ref={ref} {...props}>
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
