

import React, { useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    PanResponder
} from 'react-native';

import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function ThreeScene() {

    const animationFrame = useRef(null);
    const cameraRef = useRef(null);
    const targetRef = useRef(new THREE.Vector3(0, 0, 0));

    // Camera rotation
    const theta = useRef(0.8);
    const phi = useRef(1.1);
    const radius = useRef(10);

    const lastX = useRef(0);
    const lastY = useRef(0);

    // Example XYZ plot data
    const plots = [
        { x: 1, y: 2, z: 1 },
        { x: 2, y: 3, z: 2 },
        { x: 3, y: 4, z: 1 },
        { x: -1, y: 2, z: 3 },
        { x: -2, y: 1, z: -1 },
        { x: 1, y: -2, z: 2 },
        { x: 3, y: -1, z: -2 },
        { x: -3, y: -2, z: 1 },
    ];

    function updateCamera() {

        const camera = cameraRef.current;

        if (!camera) return;

        const r = radius.current;

        const x = r * Math.sin(phi.current) * Math.sin(theta.current);
        const y = r * Math.cos(phi.current);
        const z = r * Math.sin(phi.current) * Math.cos(theta.current);

        camera.position.set(
            targetRef.current.x + x,
            targetRef.current.y + y,
            targetRef.current.z + z
        );

        camera.lookAt(targetRef.current);
    }

    // Touch controls
    const panResponder = useRef(
        PanResponder.create({

            onStartShouldSetPanResponder: () => false,

            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                lastX.current = 0;
                lastY.current = 0;
            },

            onPanResponderMove: (event, gesture) => {

                const dx = gesture.dx - lastX.current;
                const dy = gesture.dy - lastY.current;

                lastX.current = gesture.dx;
                lastY.current = gesture.dy;

                // Two fingers = pan
                if (event.nativeEvent.touches.length >= 2) {

                    const speed = 0.015;

                    const camera = cameraRef.current;

                    if (!camera) return;

                    const right = new THREE.Vector3();
                    const up = new THREE.Vector3();

                    camera.getWorldDirection(right);
                    right.cross(camera.up).normalize();

                    up.copy(camera.up);

                    targetRef.current.addScaledVector(right, -dx * speed);
                    targetRef.current.addScaledVector(up, dy * speed);

                } else {

                    // One finger = rotate
                    theta.current -= dx * 0.01;
                    phi.current -= dy * 0.01;

                    phi.current = Math.max(
                        0.05,
                        Math.min(Math.PI - 0.05, phi.current)
                    );
                }

                updateCamera();
            },

            onPanResponderRelease: () => {
                lastX.current = 0;
                lastY.current = 0;
            },
        })
    ).current;


    const onContextCreate = (gl) => {

        const scene = new THREE.Scene();

        scene.background = new THREE.Color(0x151515);

        const camera = new THREE.PerspectiveCamera(
            60,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        );

        cameraRef.current = camera;

        updateCamera();

        const renderer = new Renderer({ gl });

        renderer.setSize(
            gl.drawingBufferWidth,
            gl.drawingBufferHeight
        );


        // XYZ GRID
        const grid = new THREE.GridHelper(
            10,
            10,
            0x555555,
            0x333333
        );

        scene.add(grid);


        // XYZ AXES
        function createAxis(start, end, color) {

            const points = [
                new THREE.Vector3(...start),
                new THREE.Vector3(...end)
            ];

            const geometry = new THREE.BufferGeometry()
                .setFromPoints(points);

            const material = new THREE.LineBasicMaterial({
                color: color
            });

            const line = new THREE.Line(geometry, material);

            scene.add(line);
        }

        createAxis([-5, 0, 0], [5, 0, 0], 0xff4444);
        createAxis([0, -5, 0], [0, 5, 0], 0x44ff44);
        createAxis([0, 0, -5], [0, 0, 5], 0x4488ff);


        // PLOT POINTS
        const pointGeometry = new THREE.SphereGeometry(
            0.12,
            12,
            12
        );

        plots.forEach((plot, index) => {

            const material = new THREE.MeshBasicMaterial({
                color: 0x58a6ff
            });

            const point = new THREE.Mesh(
                pointGeometry,
                material
            );

            point.position.set(
                plot.x,
                plot.y,
                plot.z
            );

            scene.add(point);
        });


        // RENDER LOOP
        const animate = () => {

            animationFrame.current = requestAnimationFrame(animate);

            renderer.render(scene, camera);

            gl.endFrameEXP();
        };

        animate();
    };


    useEffect(() => {

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }

            cameraRef.current = null;
        };

    }, []);


    return (
        <View
            style={styles.container}
            {...panResponder.panHandlers}
        >
            <GLView
                style={styles.canvas}
                onContextCreate={onContextCreate}
            />
        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: 350,
        backgroundColor: '#151515',
        borderRadius: 14,
        overflow: 'hidden',
    },

    canvas: {
        width: '100%',
        height: '100%',
    },

});
