import React, {useState, useEffect} from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'

export default function ScanScreen() {
    const [image, setImage] = useState(null);

    useEffect(() => {
        async function takePicture() {
            await ImagePicker.requestCameraPermissionsAsync();

            const res = await ImagePicker.launchCameraAsync();

            if (res.canceled) return;

            setImage(res.assets[0].uri);
        }

        takePicture();
    } , []);

    async function sendImageToScan(uri) {
        Alert.alert("sending image to scan" + uri)
    }
    
return (
        <View style={{ flex: 1 }}>
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ width: '100%', height: '100%' }}
                />
            )}

            
            <Pressable style={styles.sendImage} onPress={() => sendImageToScan(image)}>
                <Text style={styles.sendImageText}>
                    Send image to scan
                </Text>
            </Pressable>

        </View>
);
}

const styles = StyleSheet.create({
sendImage: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#1769AA',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        gap: 12,
},
sendImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
},
});