import React, {useState, useEffect} from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { ChevronRight, History } from 'lucide-react-native';
import { scanImage, uploadImage } from '../processHandlers/imageHandler.js';

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

        if (!uri) {
            Alert.alert('Error', 'No image selected');
            return;
        }

        try {
            

            const verdict = await scanImage(uri);

            Alert.alert(
                'Scan complete',
                `Verdict: ${verdict}`,
                [{ text: 'OK' }]
            );
            uploadImage();
        } catch (error) {

            Alert.alert(
                'Scan failed',
                error.message
            );
        }
    }
    
return (
        <View style={{ flex: 1 }}>
            {image && (
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                />
            )}
            <View style={styles.inputContainer}> 
                <TextInput style={styles.inputPatient} id="patientName" placeholder='Patient Name'></TextInput>
                <View style={styles.timeContainer}>
                    <History size={24} color="#1769AA" />
                    <Text style={styles.inputJournal}>{new Date().toLocaleString()}</Text>
                </View>
                <TextInput style={styles.inputJournal} id="Journal" placeholder='Journal...'></TextInput>
            </View>
            <Pressable style={styles.sendImage} onPress={() => sendImageToScan(image)}>
                <ChevronRight size={24} color="#ffffff" />
                <Text style={styles.sendImageText}>
                    Send image to scan
                </Text>
                
            </Pressable>

        </View>
);
}

const styles = StyleSheet.create({
image: {
    padding: 10,
    width: '100%',
    height: '30%',
    borderRadius: 14,
},
timeContainer: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
},
inputContainer: {
    padding: 10,
    display: 'flex',
    gap: 10
},
inputPatient: {
    padding: 10,
    width: '100%',
    fontSize: 30
},
inputJournal: {
    padding: 10,
    width: '100%',
},

sendImage: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#1769AA',
        flexDirection: 'row',
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