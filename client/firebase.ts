import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBgehisB7nSoGVkB8FS9zipii07T0EvJYE",
    authDomain: "sandbox-e9bef.firebaseapp.com",
    projectId: "sandbox-e9bef",
    storageBucket: "sandbox-e9bef.appspot.com",
    messagingSenderId: "387810447712",
    appId: "1:387810447712:web:d4e6aaecb808018eee0e05"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)