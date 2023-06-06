import "./styles/style.css"
import { createNavbar,
     videoSubmitEvent,
     addSignupAndLoginSubmitButtonEvents,
     addCreateAccountSubmitButtonEvent,
     } from "./domStuff"
import { addVideoPreviewEvent } from "./videoPreviewScript"
import { getApiKeyAndInitializeFirebase } from "./auth"


getApiKeyAndInitializeFirebase();

window.onload = createNavbar()
window.onload = videoSubmitEvent()
window.onload = addVideoPreviewEvent()
window.onload = addSignupAndLoginSubmitButtonEvents()
window.onload = addCreateAccountSubmitButtonEvent()

