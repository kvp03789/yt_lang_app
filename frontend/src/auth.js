import {displayUserAccountButtons} from './domStuff'
import { initializeApp } from 'firebase/app'
import {
    getAuth,
    connectAuthEmulator,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth'

export const getApiKeyAndInitializeFirebase = async () => {
    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }
    const promise = await fetch('http://localhost:5001/api/key', options)
        .then(data => {return data.json()})
        .then(data => {
            console.log(data)
            const firebaseInit = initializeApp({
                apiKey: data.key,
                authDomain: "ytanki.firebaseapp.com",
                projectId: "ytanki",
                storageBucket: "ytanki.appspot.com",
                messagingSenderId: "498252129214",
                appId: "1:498252129214:web:3fe67a1e947680c10c0fef"
              });
            return firebaseInit
        })
    
}

const firebaseApp = await getApiKeyAndInitializeFirebase()

const auth = getAuth(firebaseApp)
connectAuthEmulator(auth, 'http://localhost:9099')

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
        const userWithDisplay = await firebaseApp.auth().currentUser.updateProfile({
            displayName: signupUsername.value
        })
        console.log(userWithDisplay.user)
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

const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
        const loginAndSignupButtonsDiv = document.querySelector(".user-login-buttons-div")
        if(user){
            loginAndSignupButtonsDiv.classList.add("hidden")
            displayUserAccountButtons(user)
            console.log(user)
        }
        else{
            const userAccountNameButton = document.querySelector(".user-acc-button")
            userAccountNameButton.classList.add("hidden")
            loginAndSignupButtonsDiv.classList.remove("hidden")
            console.log('no user signed in')
        }
    })
}
monitorAuthState()

