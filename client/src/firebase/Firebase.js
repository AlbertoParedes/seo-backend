import * as fb from 'firebase/app';

//PRODUCCION
/*
var config = {
  apiKey: "AIzaSyBB087rfLzI7-rQ0wogASexU79QAiE2K0U",
  authDomain: "yoseo-42d1a.firebaseapp.com",
  databaseURL: "https://yoseo-42d1a.firebaseio.com",
  projectId: "yoseo-42d1a",
  storageBucket: "yoseo-42d1a.appspot.com",
  messagingSenderId: "193725080406",
  appId: "1:193725080406:web:cac3df42bdc89dbc"

};*/

var config = {
  apiKey: "AIzaSyDTXTJ4ch-xEz-1l9DZpmNCGdoId8kJl38",
  authDomain: "seo-yoseo.firebaseapp.com",
  databaseURL: "https://seo-yoseo.firebaseio.com",
  projectId: "seo-yoseo",
  storageBucket: "seo-yoseo.appspot.com",
  messagingSenderId: "708501128739"
};

const firebase = fb.initializeApp(config);
export default firebase;
