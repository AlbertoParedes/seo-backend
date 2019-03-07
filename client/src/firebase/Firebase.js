import * as fb from 'firebase/app';

//PRODUCCION

var config = {
  apiKey: "AIzaSyBB087rfLzI7-rQ0wogASexU79QAiE2K0U",
  authDomain: "yoseo-42d1a.firebaseapp.com",
  databaseURL: "https://yoseo-42d1a.firebaseio.com",
  projectId: "yoseo-42d1a",
  storageBucket: "yoseo-42d1a.appspot.com",
  messagingSenderId: "193725080406"
};

const firebase = fb.initializeApp(config);
export default firebase;
