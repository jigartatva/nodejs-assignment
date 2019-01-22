// Firebase Realtime Database

const firebase = require('firebase');
const logger = require('../services/logger');

// Initialize
const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

// Check connection
const connectedRef = firebase.database().ref('.info/connected');
connectedRef.on('value', snap => {
  if (snap.val() === true) {
    logger.log('>> connected');
  } else {
    logger.error('>> not connected');
  }
});

// Load Database
const db = firebase.database();

module.exports = {
  firebaseDB: db
};
