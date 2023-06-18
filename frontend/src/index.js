import "./styles/style.css"
import { clearChildElements } from "./utils"
import { buildNav,
     videoSubmitEvent,
     addSignupAndLoginSubmitButtonEvents,
     addCreateAccountSubmitButtonEvent,
     displayFlashCardsDom,
     displayVideoFrameAndInput
     } from "./domStuff"
import { addVideoPreviewEvent } from "./videoPreviewScript"
import { getApiKeyAndInitializeFirebase, monitorAuthState } from "./auth"

// const globalUser = await monitorAuthState()

export const initializeDom = (globalUser) => {
     addSignupAndLoginSubmitButtonEvents()
     addCreateAccountSubmitButtonEvent()
     displayVideoFrameAndInput()
     addVideoPreviewEvent()
     videoSubmitEvent(globalUser)
     console.log('the initial globalUserState is: ', globalUser)
}

getApiKeyAndInitializeFirebase();
window.onload = monitorAuthState() //<--this monitors the auth state and 
                                   //changes navbar accordingly
// window.onload = initializeDom(globalUser)



