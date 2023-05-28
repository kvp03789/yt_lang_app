import getVideoId from "get-video-id"
import "./styles/style.css"
import { createNavbar } from "./domStuff"
import { addVideoPreviewEvent } from "./videoPreviewScript"

createNavbar()
addVideoPreviewEvent()
const videoInput = document.querySelector("#video-src-input")
const videoFrame = document.querySelector(".video-frame")
const submitButton = document.querySelector("#submit-button")

const API_KEY = 'AIzaSyBNldJxqMmkGwTFV81H2aBUZanaIFT1Eto'


submitButton.addEventListener("click", async (e) => {
    //console.log(videoInput.value)
    //makeRequest(videoInput.value)
    
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url: videoInput.value, ...getVideoId(videoInput.value)})
    }
    const response = await fetch('http://localhost:5001/download', options)
    const json = await response.json()
    console.log(json)
})

async function makeRequest(inputValue){
    // const { id } = getVideoId(inputValue)
    // const response = await fetch(`https://www.googleapis.com/youtube/v3/captions?part=id&videoId=${id}&key=${API_KEY}
    // `)
    // console.log(await response.json())
    // console.log(id)
}

// `youtue-dl --extract-audio ${url_goes_here}`