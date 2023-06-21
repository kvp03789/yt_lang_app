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
window.onload = console.log('environmen set to: ', process.env.NODE_ENV)
getApiKeyAndInitializeFirebase();
window.onload = monitorAuthState() //<--this monitors the auth state and 
                                   //changes navbar accordingly
// window.onload = initializeDom(globalUser)





