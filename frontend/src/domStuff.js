import { clearChildElements, createElement } from "./utils";
import getVideoId from "get-video-id"
import { loginToAccount, createAccount, logoutOfAccount } from "./auth";
import { cardDeck } from "./cardStuff";
import LoadingGif from './assets/loading.gif'
import CartamiLogo from './assets/cartami_mk4.png'
import RightArrow from './assets/svg/right-arrow.png'
import { db } from "./auth";
import { collection, getDoc, setDoc, set } from "firebase/firestore";

export const buildUserNav = (userObject) => {
    const navElement = document.querySelector("nav");
        //clear nav first
    clearChildElements(navElement)
    const cartamiLogo = new Image()
    const rightArrow = new Image()
    const userAccButton = createElement("button", ["user-acc-button", "nav-link"])
    const userAccountDisplayContainer = createElement("div", ["user-account-display-div"])
    const cancelLoginButton = document.querySelector("#cancel-login-button")
    const cancelSignupButton = document.querySelector("#cancel-signup-button")
    const dropDown = createElement("div", ["user-drop-down", "hidden"])
    const logoutButton = createElement("div", ["logout-button", "nav-link", "drop-down-link"])
    const savedDecksButton = createElement("div", ["nav-link", "drop-down-link"])
    const profileButton = createElement("div", ["nav-link", "drop-down-link"])

    const showUserDropDown = (userObject) => {
        rightArrow.classList.contains("rotate90")  
        ? rightArrow.classList.remove("rotate90")
        : rightArrow.classList.add("rotate90")
        
        dropDown.classList.contains("hidden")
        ? dropDown.classList.remove("hidden")
        : dropDown.classList.add("hidden")
    }

    logoutButton.addEventListener("click", logoutOfAccount)
    
    cartamiLogo.classList.add("text-logo")
    cartamiLogo.src = CartamiLogo
    rightArrow.src = RightArrow
    profileButton.innerText = 'profile'
    logoutButton.innerText = 'logout'
    savedDecksButton.innerText = 'saved decks'
    rightArrow.classList.add("arrow-svg")
    userAccButton.innerText = userObject.email
    dropDown.append(profileButton, savedDecksButton, logoutButton)
    userAccountDisplayContainer.append(rightArrow, userAccButton, dropDown)
    navElement.append(userAccountDisplayContainer)

    userAccountDisplayContainer.addEventListener("click", () => {
        showUserDropDown()
    })

    cancelLoginButton.addEventListener("click", (e) => opaqueContainerLoginEvent(e))
    cancelSignupButton.addEventListener("click", (e) => opaqueContainerSignupEvent(e))
}

export const buildNoUserNav = () => {
    const navElement = document.querySelector("nav");
    //clear nav first
    clearChildElements(navElement)
    const cartamiLogo = new Image()
    const signupButton = createElement("button", ["nav-link", "signup-link"])
    const loginButton = createElement("button", ["nav-link", "login-link"])
    const userLoginButtonsContainer = createElement("div", ["user-login-buttons-div"])
    const cancelLoginButton = document.querySelector("#cancel-login-button")
    const cancelSignupButton = document.querySelector("#cancel-signup-button")

    cartamiLogo.classList.add("text-logo")
    cartamiLogo.src = CartamiLogo
    signupButton.innerText = 'sign up'
    loginButton.innerText = 'login'

    signupButton.addEventListener("click", signupButtonDomEvent)
    loginButton.addEventListener("click", loginButtonDomEvent)
    cancelLoginButton.addEventListener("click", (e) => opaqueContainerLoginEvent(e))
    cancelSignupButton.addEventListener("click", (e) => opaqueContainerSignupEvent(e))

    userLoginButtonsContainer.append(cartamiLogo, signupButton, loginButton)
    navElement.append(userLoginButtonsContainer)

}

export const videoSubmitEvent = (globalUserState) => {
    const videoSubmitButton = document.querySelector(".video-submit-button")
    const videoInput = document.querySelector("#video-src-input")

    videoSubmitButton.setAttribute('disabled', '')

    videoSubmitButton.addEventListener("click", async (e) => {
        displayLoadingGif();
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: videoInput.value, ...getVideoId(videoInput.value)})
        }
        const response = await fetch('http://localhost:5001/download', options)
        const json = await response.json()
        console.log('this is the json: ', json)
        const deckArray = formatData(JSON.parse(json))
        //INIT THE CARD DECK OBJECT
        // initDeck(deckArray)
        cardDeck.deck = deckArray
        displayFlashCardsDom(cardDeck.deck[0].front, cardDeck.deck[0].back, globalUserState)
    })
}

//FUNCTION TO FORMAT RESPONSE DATA FROM API, THEN CALL FUNCTION TO DISPLAY CARDS
function formatData(json) {
    const deckArray = []
    for(const key in json){
        const cardObject = {}
        cardObject.front = `${key}`;
        cardObject.back = `${json[key]}`
        deckArray.push(cardObject)
    }
    console.log('this is the deck: ', deckArray)
    return deckArray
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

export const displayLoadingGif = () => {
    const main = document.querySelector("main")
    clearChildElements(main)
    const loadingImage = new Image()
    loadingImage.src = LoadingGif
    main.append(loadingImage)
}

export const displayFlashCardsDom = (dataFront, dataBack, globalUserState) => {
    const main = document.querySelector("main");
    clearChildElements(main)

    const cardContainer = createElement("div", ["card"])
    const cardFront = createElement("div", ["card-front", "card-face"])
    const cardBack = createElement("div", ["card-back",  "card-face"])
    const frontCardText = createElement("p", ["front-card-text"])
    const backCardText = createElement("p", ["back-card-text"])
    const buttonContainer = createElement("div", ["card-button-container"])
    const nextCardButton = createElement("button", ["card-nav-button"])
    const showAnswerButton = createElement("button", ["card-nav-button"])
    const homeButton = createElement("button", ["back-to-transcription-button"])
    const homeButtonContainer = createElement("div", ["home-button-container"])

    frontCardText.innerText = `${dataFront}`;
    backCardText.innerText = `${dataBack}`

    nextCardButton.setAttribute("id", "next-card-button")
    showAnswerButton.setAttribute("id", "show-answer-button")
    nextCardButton.innerText = 'next card'
    showAnswerButton.innerText = 'show answer'
    homeButton.innerText = 'transcribe new video'

    cardFront.append(frontCardText)
    cardBack.append(backCardText)
    cardContainer.append(cardFront, cardBack)
    buttonContainer.append(nextCardButton, showAnswerButton)
    homeButtonContainer.append(homeButton)
    main.append(cardContainer, buttonContainer, homeButtonContainer)

    addFlashCardButtonEvents()

    if(globalUserState !== null ){
        const saveDeckButton = createElement("button", ["card-nav-button"])
        saveDeckButton.innerText = 'save this deck!'
        buttonContainer.append(saveDeckButton)
        //event to save deck to current user's collection in database
        saveDeckButton.addEventListener("click", async () => {
            const deckToSave = cardDeck.deck.map(x => x)
            const parentDocRef = await getDoc(db, "users", `${globalUserState.uid}`)
            // const parentDocRef = await db.collection("users").doc(`${globalUserState.uid}`)
            const subCollectionRef = await parentDocRef.collection("savedDecksSubCollection")
            const savedSubCollection = await subCollectionRef.setDoc({cards: [...deckToSave]})
            console.log('document saved to subcollection ', savedSubCollection)

        })
    }
    else{
        const alertPara = createElement("p", ["alert-paragraph"])
        alertPara.innerText = 'login or signup to save decks for future review!'
    }
}



function addFlashCardButtonEvents (){
    const main = document.querySelector("main")
    const showAnswerButton = document.querySelector("#show-answer-button")
    const nextCardButton = document.querySelector("#next-card-button")
    const cardContainer = document.querySelector(".card")
    const homeButton = document.querySelector(".back-to-transcription-button")

    showAnswerButton.addEventListener('click', () => {
        cardContainer.classList.toggle("card-is-flipped")
})

    nextCardButton.addEventListener('click', ()  =>  {
        if(cardContainer.classList.contains("card-is-flipped")){
            cardContainer.classList.remove("card-is-flipped")

        }
        cardDeck.showNextCard()
})
    homeButton.addEventListener("click", () => {
        clearChildElements(main)
        displayVideoFrameAndInput()
    })
}

export const displayVideoFrameAndInput = () => {
    const main = document.querySelector("main")
    clearChildElements(main)
    const videoFrame = createElement("div", ["video-frame"])
    const iframe = createElement("iframe")
    const formContainer = createElement("div", ["video-url-form-container"])
    const videoUrlInput = createElement("input")
    const videoSubmitButton = createElement("button", ["video-submit-button"])
    const testButton = createElement("button", ["test-button"])

    iframe.setAttribute("id", "video-frame")
    iframe.setAttribute("width", "420")
    iframe.setAttribute("height", "315")
    videoUrlInput.setAttribute("id", "video-src-input")
    videoUrlInput.setAttribute("name", "video-src")
    videoUrlInput.setAttribute("placeholder", "enter a youtube url")
    videoSubmitButton.innerText = 'get transcript!'
    testButton.innerText = 'TEST BUTTON'

    formContainer.append(videoUrlInput, videoSubmitButton)
    videoFrame.append(iframe)
    main.append(videoFrame, formContainer)

//     testButton.addEventListener('click', () => {
//         displayFlashCardsDom()
//    })
}

//SET 'cardDeck.deck' WITH FORMATTED ARRAY RETURNED FROM API
const initDeck = (data) => {
    cardDeck.deck = data
    displayFlashCardsDom(data[0].front, data[0].back)

    console.log(cardDeck)
    //cardDeck.populateFirstCards()
}
