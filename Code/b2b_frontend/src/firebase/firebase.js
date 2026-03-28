import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC29yuvzamef-iFGRpLIXMr8slfK9G2_XY",
    authDomain: "mstterlik.firebaseapp.com",
    projectId: "mstterlik",
    storageBucket: "mstterlik.firebasestorage.app",
    messagingSenderId: "806871706739",
    appId: "1:806871706739:web:04024ad8c5dc15e61a0e06",
    measurementId: "G-36R9FS05HD"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
