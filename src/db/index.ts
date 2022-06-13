import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PID,
  storageBucket: process.env.REACT_APP_SB,
  messagingSenderId: process.env.REACT_APP_SID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MID,
};

const app = initializeApp(firebaseConfig);
// initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_SITE_KEY ? process.env.REACT_APP_RECAPTCHA_SITE_KEY : ''),

//   isTokenAutoRefreshEnabled: true
// });

const db = getFirestore(app);
export const auth = getAuth();

export default db;
