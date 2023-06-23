import { clearChildElements, createElement } from "./utils";
import getVideoId from "get-video-id"
import { loginToAccount, createAccount, logoutOfAccount } from "./auth";
import { cardDeck } from "./cardStuff";
import LoadingGif from './assets/loading.gif'
import CartamiLogo from './assets/cartami_mk4.png'
import RightArrow from './assets/svg/right-arrow.png'
import { db } from "./auth";
import { doc, updateDoc, getDoc, setDoc, set } from "firebase/firestore";

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

    profileButton.addEventListener("click", () => {
        showUserProfile(userObject)
    })

    savedDecksButton.addEventListener("click", () => {
        showSavedDecks(userObject)
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
    const languageInput = document.querySelector('#languages')
    videoSubmitButton.setAttribute('disabled', '')

    videoSubmitButton.addEventListener("click", async (e) => {
        displayLoadingGif();
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: videoInput.value, language: languageInput.value, ...getVideoId(videoInput.value)})
        }
        const response = await fetch(
            process.env.NODE_ENV === 'development'
            ? 'http://localhost:5001/download'
            : 'http://157.230.210.69:443/download', 
            options
            )
        const json = await response.json()
        console.log('this is the json: ', json)
        const deckArray = formatData(JSON.parse(json))
        //INIT THE CARD DECK OBJECT
        // initDeck(deckArray)
        cardDeck.deck = deckArray
        cardDeck.deckName = `${videoInput.value}`
        displayFlashCardsDom(cardDeck.deck[0].front, cardDeck.deck[0].back, globalUserState, cardDeck.deckName)
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

export const displayFlashCardsDom = (dataFront, dataBack, globalUserState, deckName) => {
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
        const deckNameInput = createElement("input", ["deck-name-input", "hidden"])
        const startSaveDeckButton = createElement("button", ["card-nav-button"])
        const saveDeckButton = createElement("button", ["card-nav-button", "hidden"])

        deckNameInput.setAttribute("placeholder", "enter a name for this deck")
        startSaveDeckButton.innerText = 'save this deck!'
        saveDeckButton.innerText = 'save!'
        buttonContainer.append(startSaveDeckButton, deckNameInput, saveDeckButton)

        //event to show hidden button and input
        startSaveDeckButton.addEventListener("click", () => {
            saveDeckButton.classList.remove("hidden")
            deckNameInput.classList.remove("hidden")
        })
        //event to save deck to current user's collection in database
        saveDeckButton.addEventListener("click", async () => {
            const deckToSave = cardDeck.deck.map(x => x)
            const parentDocRef = doc(db, "users", `${globalUserState.uid}`)
            const parentDocSnap = await getDoc(parentDocRef)
            const updated = await updateDoc(parentDocRef, {
                savedDecks: [{deckName: deckNameInput.value ? deckNameInput.value : deckName, deck: [...deckToSave]}]
            })
            saveDeckButton.classList.add("hidden")
            deckNameInput.classList.add("hidden")
            startSaveDeckButton.classList.add("hidden")
            const deckSavedMessage = createElement("p", ["deck-saved-message"])
            deckSavedMessage.innerText = 'deck saved for later review :3'
            buttonContainer.append(deckSavedMessage)
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
    const dropDownLanguageSelection = createElement("select", ["language-select"])
    const frenchOption = createElement("option")
    const spanishOption = createElement("option")
    const germanOption = createElement("option")

    dropDownLanguageSelection.setAttribute("name", "languages")
    dropDownLanguageSelection.setAttribute("id", "languages")
    frenchOption.setAttribute("value", "French")
    frenchOption.innerText = 'French'
    spanishOption.setAttribute("value", "Spanish")
    spanishOption.innerText = 'Spanish'
    germanOption.setAttribute("value", "German")
    germanOption.innerText = 'German'

    iframe.setAttribute("id", "video-frame")
    iframe.setAttribute("width", "420")
    iframe.setAttribute("height", "315")
    videoUrlInput.setAttribute("id", "video-src-input")
    videoUrlInput.setAttribute("name", "video-src")
    videoUrlInput.setAttribute("placeholder", "enter a youtube url")
    videoSubmitButton.innerText = 'get transcript!'
    testButton.innerText = 'TEST BUTTON'

    dropDownLanguageSelection.append(frenchOption, spanishOption, germanOption)
    formContainer.append(videoUrlInput, dropDownLanguageSelection, videoSubmitButton)
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

function showUserProfile(userObject){
    const main = document.querySelector("main")
    clearChildElements(main)
    const userHeader = createElement("h1")
    userHeader.innerText = `${userObject.email}`

    main.append(userHeader)
}

async function showSavedDecks(userObject){
    const main = document.querySelector("main")
    clearChildElements(main)
    const savedDecksHeader = createElement("h1")
    const deckListContainer = createElement("div", ["deck-list-container"])

    const parentDocRef = doc(db, "users", `${userObject.uid}`)
    const parentDocSnap = await getDoc(parentDocRef)
    const savedDecksArray = parentDocSnap.data()
    console.log('YO HERES THE DATA TM: ', savedDecksArray)

    savedDecksArray.savedDecks.forEach(deck => {
        const deckNameContainer = createElement("div", ["deck-name-container"])
        const deckName = createElement("h3", ["deck-name-h3"])
        deckName.innerText = deck.deckName
        deckNameContainer.append(deckName)
        deckListContainer.append(deckNameContainer)
        deckNameContainer.addEventListener("click", () => {
            displayUserReviewDeck(deck.deck, deck.deckName)
            })
        })
    savedDecksHeader.innerText = `saved decks for ${userObject.email}`
    main.append(savedDecksHeader, deckListContainer)
}

function displayUserReviewDeck(deckArray, deckTitle){
    console.log(deckArray)
    const tempCardDeck = {
        deckName: '',
    
        deck: [...deckArray],
            //format like this: {front: 'question1', back: 'answer1'}
    
        counter: 0,
    
        showNextCard(){
            console.log(this.deck)
            this.counter++;
            if(this.counter > tempCardDeck.deck.length - 1){
                this.counter = 0;
            }
            const frontCardPara = document.querySelector('.front-card-text')
            const backCardPara = document.querySelector('.back-card-text')
            frontCardPara.innerText = `${this.deck[this.counter].front}`;
            backCardPara.innerText = `${this.deck[this.counter].back}`
        }
    }

    const main = document.querySelector("main");
    clearChildElements(main)

    const deckReviewTitle = createElement("h1", ["deck-review-title"])
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

    frontCardText.innerText = `${tempCardDeck.deck[0].front}`;
    backCardText.innerText = `${tempCardDeck.deck[0].back}`

    nextCardButton.setAttribute("id", "next-card-button")
    showAnswerButton.setAttribute("id", "show-answer-button")
    nextCardButton.innerText = 'next card'
    showAnswerButton.innerText = 'show answer'
    homeButton.innerText = 'transcribe new video'
    deckReviewTitle.innerText = `currently reviewing deck "${deckTitle}"`

    cardFront.append(frontCardText)
    cardBack.append(backCardText)
    cardContainer.append(cardFront, cardBack)
    buttonContainer.append(nextCardButton, showAnswerButton)
    homeButtonContainer.append(homeButton)
    main.append(deckReviewTitle, cardContainer, buttonContainer, homeButtonContainer)

    nextCardButton.addEventListener("click", tempCardDeck.showNextCard)
    homeButton.addEventListener("click", displayVideoFrameAndInput)
}