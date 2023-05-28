import { createElement } from "./utils";

export const createNavbar = () => {
    const nav = document.querySelector("nav");
    const loginLink = createElement("button", ["nav-link", "login-link"])
    const opaqueSignupContainer = document.querySelector(".signup-container")
    const opaqueLoginContainer = document.querySelector(".login-container")


    loginLink.innerText = "Login"
    const signupLink = createElement("button", ["nav-link", "signup-link"])
    signupLink.innerText = "Signup"
    loginLink.setAttribute("href", "/")
    signupLink.setAttribute("href", "/")

    nav.append(signupLink, loginLink)

    signupLink.addEventListener("click", signupButtonDomEvent)
    loginLink.addEventListener("click", loginButtonDomEvent)
    opaqueSignupContainer.addEventListener("click", (e) => opaqueContainerSignupEvent(e))
    opaqueLoginContainer.addEventListener("click", (e) => opaqueContainerLoginEvent(e))

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
    console.log("it works", e.target)
    const opaque = document.querySelector(".signup-container");
    if(!opaque.classList.contains("hidden")){
        opaque.classList.add("hidden");
    }
}

function opaqueContainerLoginEvent(e){
    console.log("it works", e.target)
    const opaque = document.querySelector(".login-container");
    if(!opaque.classList.contains("hidden")){
        opaque.classList.add("hidden");
    }
}

