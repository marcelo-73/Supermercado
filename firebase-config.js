// firebase-config.js

// Tu configuración de Firebase (reemplaza con la tuya)
const firebaseConfig = {
apiKey: "AIzaSyDwNdVyTsqi17fjNGT2aceqkaCvn2ai4ws",
authDomain: "supermercado-43952.firebaseapp.com",
projectId: "supermercado-43952",
storageBucket: "supermercado-43952.firebasestorage.app",
messagingSenderId: "856218650925",
appId: "1:856218650925:web:648eeae492a32193f9eba4"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
