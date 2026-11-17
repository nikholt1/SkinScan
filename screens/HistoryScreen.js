import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
// import { getImages } from '../processHandlers/imageHandler.js';

export default function HistoryScreen() {

    // TEST IMAGES
    const images = [
        {
            id: 'test1',
            image: 'https://treatcancer.com/wp-content/uploads/2022/08/Normal-mole-2.png',
            timeStamp: '16.11.2026, 15.02.00',
            verdict: 0.4,
        },
        {
            id: 'test2',
            image: 'https://patch.com/img/cdn/users/2587664/2014/11/raw/546d5945cd6a9.jpg',
            timeStamp: '17.11.2026, 10.30.00',
            verdict: 0.4,
        }
    ];

    // REAL FIREBASE IMAGES
    /*
    const [images, setImages] = useState([]);

    useEffect(() => {
        const unsubscribe = getImages(setImages);

        return () => unsubscribe();
    }, []);
    */

    return (
        <ScrollView>
            {images.map((item) => (
                <View key={item.id}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: '100%',
                            height: 300,
                            background: 'grey',
                        }}
                        resizeMode="contain"
                    />

                    <Text>{item.timeStamp}</Text>
                    <Text>{item.verdict}</Text>
                </View>
            ))}
        </ScrollView>
    );
}