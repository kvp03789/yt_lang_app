require('dotenv').config()



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.FB_KEY}`,
  authDomain: "ytanki.firebaseapp.com",
  projectId: "ytanki",
  storageBucket: "ytanki.appspot.com",
  messagingSenderId: "498252129214",
  appId: "1:498252129214:web:3fe67a1e947680c10c0fef"
};

module.exports = firebaseConfig