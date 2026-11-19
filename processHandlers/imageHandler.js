import { collection, onSnapshot } from "firebase/firestore";
import { Alert } from 'react-native';
import { db, storage } from "../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { File } from 'expo-file-system';



export async function uploadImage(uri, verdict, name, jernal, timestamp) {
    Alert.alert("Uploading image")
}




export function getImages(setImages) {
    const imageCollection = collection(db, "moles");
    const storage = getStorage();

    const unsubscribe = onSnapshot(
        imageCollection,
        async (snapshot) => {
            console.log("Documents found:", snapshot.size);

            const loadedImages = await Promise.all(
                snapshot.docs.map(async (document) => {
                    const data = document.data();

                    let imageURL = null;

                    try {
                        const imageRef = ref(
                            storage,
                            `moles/${document.id}.jpg`
                        );

                        imageURL = await getDownloadURL(imageRef);
                    } catch (error) {
                        console.error(
                            `Failed to load image for ${document.id}:`,
                            error
                        );
                    }

                    return {
                        id: document.id,
                        timeStamp: data.Date,
                        image: imageURL
                    };
                })
            );

            console.log("Loaded images:", loadedImages);
            setImages(loadedImages);
        },
        (error) => {
            console.error("Error in Firestore:", error);
        }
    );

    return unsubscribe;
}





const API_URL = 'http://192.168.0.131:5000/cnn/return';

export async function scanImage(uri) {
    if (!uri) {
        throw new Error('No image URI provided');
    }

    // Create a File from the local image URI
    const file = new File(uri);

    console.log('Image size:', file.size);
    console.log('Image type:', file.type);

    // Send the actual file as the HTTP request body
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'image/jpeg',
        },
        body: file,
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const verdict = await response.json();

    if (typeof verdict !== 'number') {
        throw new Error('Expected a number from server');
    }

    return verdict;
}



// Delete image from Firebase Storage / Firestore
export async function deleteImage(imageId) {

}

