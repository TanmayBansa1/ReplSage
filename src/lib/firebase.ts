// Import the functions you need from the SDKs you need
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { FirebaseConfig } from "./config";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = FirebaseConfig;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export const uploadFile = async (file: File, setProgress: (progress: number) => void) => {

    return new Promise((resolve, reject) => {
        try {
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed", (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            }, error => {
                reject(error)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                    resolve(downloadURL);
                });
            })
        } catch (error) {
            console.log("error while uploading file",error)
            reject(error)
        }
    })
}