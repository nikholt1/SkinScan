
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function ThreeScene() {

    const animationFrame = useRef(null);

    const onContextCreate = (gl) => {

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x151515);

        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        );

        camera.position.z = 5;

        const renderer = new Renderer({ gl });

        renderer.setSize(
            gl.drawingBufferWidth,
            gl.drawingBufferHeight
        );

        const geometry = new THREE.BoxGeometry(2, 2, 2);

        const material = new THREE.MeshNormalMaterial();

        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);

        let active = true;

        const animate = () => {

            if (!active) return;

            animationFrame.current = requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);

            gl.endFrameEXP();
        };

        animate();

        return () => {
            active = false;

            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }

            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    };

    return (
        <View style={styles.container}>
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
        height: 260,
        backgroundColor: '#151515',
        borderRadius: 14,
        overflow: 'hidden',
    },

    canvas: {
        width: '100%',
        height: '100%',
    },
});
