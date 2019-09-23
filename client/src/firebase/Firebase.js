import * as fb from 'firebase/app';
import "firebase/firestore";
require('dotenv').config()


const config = JSON.parse(process.env.REACT_APP_FIREBASE_KEY)
const firebase = fb.initializeApp(config);
const firestore = firebase.firestore(); 
//const settings = {timestampsInSnapshots: true };
//firestore.settings(settings);


export default firebase;
