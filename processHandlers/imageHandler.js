import { collection, onSnapshot } from "firebase/firestore";

import { db, storage } from "../firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
export async function uploadImage(uri) {

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


// Send image to scanning service
export async function scanImage(uri) {

}

// Delete image from Firebase Storage / Firestore
export async function deleteImage(imageId) {

}

