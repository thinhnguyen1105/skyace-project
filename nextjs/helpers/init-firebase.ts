import firebase from 'firebase';
import config from '../../api/config';

const initFirebaseApp = () => {
  return firebase.initializeApp({
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    databaseURL: config.firebase.databaseURL,
    storageBucket: config.firebase.storageBucket
  });
};

export default initFirebaseApp;