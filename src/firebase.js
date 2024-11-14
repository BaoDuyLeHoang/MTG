import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBw6N9C4DLpOWb8T6cbLgWSl_-XbD66DzI",
    authDomain: "mtg-capstone-2024.firebaseapp.com",
    projectId: "mtg-capstone-2024",
    storageBucket: "mtg-capstone-2024.appspot.com",
    messagingSenderId: "19174167205",
    appId: "1:19174167205:web:67d826bf903a39c792734c",
    measurementId: "G-ECRWN5YX12"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
