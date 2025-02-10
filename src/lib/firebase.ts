// Import the functions you need from the SDKs you need
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6emiOkNohRAt165R_ydZj0DvFrK5ik48",
  authDomain: "replsage-f928b.firebaseapp.com",
  projectId: "replsage-f928b",
  storageBucket: "replsage-f928b.firebasestorage.app",
  messagingSenderId: "1054921066051",
  appId: "1:1054921066051:web:7608ab429f984b3313b6f6",
  measurementId: "G-JW0BYK7H4Z"
};

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