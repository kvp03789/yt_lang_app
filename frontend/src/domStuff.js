import { createElement } from "./utils";
import getVideoId from "get-video-id"
import { loginToAccount, createAccount, logoutOfAccount } from "./auth";


export const createNavbar = () => {
    const nav = document.querySelector("nav");
    const signupLink = document.querySelector(".signup-link")
    const loginLink = document.querySelector(".login-link")
    const opaqueSignupContainer = document.querySelector(".signup-container")
    const opaqueLoginContainer = document.querySelector(".login-container")
    const cancelLoginButton = document.querySelector("#cancel-login-button")
    const cancelSignupButton = document.querySelector("#cancel-signup-button")
    // loginLink.innerText = "Login"
    // signupLink.innerText = "Signup"
    // loginLink.setAttribute("href", "/")
    // signupLink.setAttribute("href", "/")

    // nav.append(signupLink, loginLink)

    signupLink.addEventListener("click", signupButtonDomEvent)
    loginLink.addEventListener("click", loginButtonDomEvent)
    //opaqueSignupContainer.addEventListener("click", (e) => opaqueContainerSignupEvent(e))
    //opaqueLoginContainer.addEventListener("click", (e) => opaqueContainerLoginEvent(e))
    cancelLoginButton.addEventListener("click", (e) => opaqueContainerLoginEvent(e))
    cancelSignupButton.addEventListener("click", (e) => opaqueContainerSignupEvent(e))
}

export const videoSubmitEvent = () => {
    const videoSubmitButton = document.querySelector("#video-submit-button")
    const videoInput = document.querySelector("#video-src-input")
    const videoFrame = document.querySelector(".video-frame")

    videoSubmitButton.setAttribute('disabled', '')

    videoSubmitButton.addEventListener("click", async (e) => {
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: videoInput.value, ...getVideoId(videoInput.value)})
        }
        const response = await fetch('http://localhost:5001/download', options)
        const json = await response.json()
        console.log(json)
        populateTranscriptContainer(json)
    })
}

function populateTranscriptContainer(json) {
    const trascriptContainer = document.querySelector(".transcript-container")
    const textContainer = createElement("div", ["text-container"])
    const para = createElement("p", ["transcript-text"])
    para.innerText = json.transcript;
    textContainer.append(para)
    trascriptContainer.append(textContainer)
}


function signupButtonDomEvent() {
    const signupContainer = document.querySelector(".signup-container");
    if(signupContainer.classList.contains("hidden")){
        signupContainer.classList.remove("hidden");
    }
    else{
        signupContainer.classList.add("hidden")
    }
    console.log("ok i did it")
}

function loginButtonDomEvent() {
    const loginContainer = document.querySelector(".login-container");
    if(loginContainer.classList.contains("hidden")){
        loginContainer.classList.remove("hidden");
    }
    else{
        loginContainer.classList.add("hidden")
    }
    console.log("ok i did it login")
}

function opaqueContainerSignupEvent(e){
    e.preventDefault()
    console.log("it works", e.target)
    const opaque = document.querySelector(".signup-container");
    if(!opaque.classList.contains("hidden")){
        opaque.classList.add("hidden");
    }
}

function opaqueContainerLoginEvent(e){
    e.preventDefault()
    console.log("it works", e.target)
    const opaque = document.querySelector(".login-container");
    if(!opaque.classList.contains("hidden")){
        opaque.classList.add("hidden");
    }
}

export const addSignupAndLoginSubmitButtonEvents = () => {
    const loginButton = document.querySelector('#login-submit-button')
    loginButton.addEventListener('click', (e) => {loginToAccount(e)})
}

export const addCreateAccountSubmitButtonEvent = () => {
    const signupButton = document.querySelector('#signup-submit-button')
    signupButton.addEventListener('click', (e) => createAccount(e))
}

export const displayUserAccountButtons = (user) => {
    const userAccButton = document.querySelector(".user-acc-button")
    userAccButton.classList.remove("hidden")
    userAccButton.innerText = `${user.displayName}`
    userAccButton.addEventListener("click", logoutOfAccount)
}