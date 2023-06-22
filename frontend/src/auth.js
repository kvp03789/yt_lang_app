import { initializeDom } from '.';
import { buildUserNav, buildNoUserNav, displayUserAccountButtons} from './domStuff'
import { initializeApp, firebase } from 'firebase/app';
import { 
    getFirestore, 
    collection,
    doc,
    setDoc,
    connectFirestoreEmulator } from 'firebase/firestore';
import {
    getAuth,
    connectAuthEmulator,
    updateProfile,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut } from 'firebase/auth'

export const getApiKeyAndInitializeFirebase = async () => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        mode: 'no-cors'
    }
    const promiseData = await fetch(process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001/api/key'
    : 'https://cartami-backend.up.railway.app/api/key', options)
    const jsonData = await promiseData.json()

    console.log('firebase api key: ', jsonData)
    const firebaseInit = initializeApp({
        apiKey: jsonData.key,
        authDomain: "ytanki.firebaseapp.com",
        projectId: "ytanki",
        storageBucket: "ytanki.appspot.com",
        messagingSenderId: "498252129214",
        appId: "1:498252129214:web:3fe67a1e947680c10c0fef"
        });
    return firebaseInit
}

const firebaseApp = await getApiKeyAndInitializeFirebase()
console.log(firebaseApp, 'this is the firebaseApp variable')
//init firebase services: 
const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
//then connect to emulators:
// connectAuthEmulator(auth, 'http://localhost:9099')
// connectFirestoreEmulator(db, 'http://localhost:8080');


export const loginToAccount = async (e) => {
    e.preventDefault()
    const errorP = document.querySelector(".login-error-p")
    const loginEmail = document.querySelector("#email-input")
    const loginPassword = document.querySelector("#password-input")
    const loginContainer = document.querySelector(".login-container");
    
    try{
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        console.log(userCredential.user)
        loginContainer.classList.add("hidden")
    }
    catch(err){
        console.log(err)
        errorP.innerHTML = `error: ${err.messages}`
    }
    
}

export const createAccount = async (e) => {
    e.preventDefault()
    const errorP = document.querySelector(".signup-error-p")
    const signupEmail = document.querySelector("#signup-email")
    const signupPassword = document.querySelector("#signup-password")
    const signupUsername = document.querySelector("#signup-username")
    const signupContainer = document.querySelector(".signup-container");
    
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.value, signupPassword.value)
        // const userWithDisplay = await firebaseApp.auth().currentUser.updateProfile({
        //     displayName: signupUsername.value
        // })

        //ADD USER TO A 'USERS' COLLECTION IN FIRESTORE
        const docRef = await setDoc(doc(db, "users", `${userCredential.user.uid}`), {
            savedDecks: "none"
    })
        console.log(docRef)
        signupContainer.classList.add("hidden")
    }
    catch(err){
        console.log(err)
        errorP.innerText = `error: ${err.message}`
    }    
}

export const logoutOfAccount = async () => {
    await signOut(auth)
}

export const monitorAuthState = async () => {
    console.log('monitoring auth state')
    return onAuthStateChanged(auth, user => {
         //if no user, display no user navbar
        if(user){
            buildUserNav(user)
            initializeDom(user)
            console.log('user signed in: ', user)
            return user
        }
        else{
            buildNoUserNav()
            initializeDom(user)
            console.log('no user signed in', user)
            return null
        }
    })
}

export const checkAuthState = async () => {
    return onAuthStateChanged(auth, user => {
        if (user)return user
        else return null
    })
}


