
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getToken, initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// 🔹 Initialize Firebase App Check with reCAPTCHA
export const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true, // Automatically refresh tokens
});

export const uploadFile = async (file: File, setProgress: (progress: number) => void) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 🔹 Get App Check token before uploading
            const appCheckToken = await getToken(appCheck, true);  
            if (!appCheckToken?.token) {
                throw new Error("Failed to get App Check token");
            }
            console.log("App Check token:", appCheckToken.token);

            // Generate unique filename
            const uniqueFileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `meetings/${uniqueFileName}`);

            // 🔹 Set request headers with App Check token
            const metadata = {
                customMetadata: {
                    "firebase-app-check": appCheckToken.token,
                },
            };

            const uploadTask = uploadBytesResumable(storageRef, file, metadata);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(progress);
                },
                (error) => {
                    console.error("Upload error:", error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (urlError) {
                        console.error("Error getting download URL:", urlError);
                        reject(urlError);
                    }
                }
            );
        } catch (error) {
            console.error("Unexpected error in uploadFile:", error);
            reject(error);
        }
    });
};

