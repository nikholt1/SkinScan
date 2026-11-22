import React, {useState, useEffect} from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { ChevronRight, History, HeartPulse } from 'lucide-react-native';
import { scanImage, uploadImage } from '../processHandlers/imageHandler.js';

export default function ScanScreen() {
    const [image, setImage] = useState(null);
    const [verdict, setVerdict] = useState('');
    

    async function takePicture() {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                'Permission required',
                'Camera permission is needed to take a picture.'
            );
            return;
        }

        const res = await ImagePicker.launchCameraAsync();

        if (res.canceled) {
            return;
        }

        setImage(res.assets[0].uri);
    }

    async function chooseImage() {
    const existing =
        await ImagePicker.getMediaLibraryPermissionsAsync();

    console.log(existing);

    let permission = existing;

    if (!existing.granted) {
        permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    console.log(permission);

    if (!permission.granted) {
        Alert.alert(
        'Permission required',
        !permission.canAskAgain
            ? 'Permission was denied. Enable Photos access in Settings.'
            : 'Photos permission is needed to choose an image.'
        );
        return;
    }

    const result =
        await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        });

    if (!result.canceled) {
        setImage(result.assets[0].uri);
    }
    }
    async function sendImageToScan(uri) {

        if (!uri) {
            Alert.alert('Error', 'No image selected');
            return;
        }

        try {
            

            const res = await scanImage(uri);

            // Alert.alert(
            //     'Scan complete',
            //     `Verdict: ${verdict}`,
            //     [{ text: 'OK' }]
            // );
            setVerdict(res);
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
                <View style={styles.imageChoisesContainer}>
                    <Pressable onPress={takePicture} style={styles.imageChoiseBtn}><Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>Take Picture</Text></Pressable>
                    <Pressable onPress={chooseImage} style={styles.imageChoiseBtn}><Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>Choose Image</Text></Pressable>
                </View>
                <TextInput style={styles.inputPatient} id="patientName" placeholder='Patient Name'></TextInput>
                <View style={styles.timeContainer}>
                    <History size={24} color="#1769AA" />
                    <Text style={styles.inputJournal}>{new Date().toLocaleString()}</Text>
                </View>
                <TextInput style={styles.inputJournal} id="Journal" placeholder='Journal...'></TextInput>
                <View style={styles.verdictContainer}>
                    <HeartPulse size={35} color="#dc4545" />
                    <Text>Scan result: {verdict}</Text>
                    <Text>Percentage verdict: <Text style={styles.percentageVerdict}> {(verdict * 100).toFixed(0)}%</Text></Text>
                </View>
                
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
imageChoisesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
},
imageChoiseBtn: {
    backgroundColor: '#1769AA',
    padding: 20,
    borderRadius: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
verdictContainer: {
    display: 'flex',
    padding: 10,
    gap: 5,

},
percentageVerdict: {
    fontSize: 23,
    fontWeight: 'bold',
},
sendImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
},
});