import getVideoId from "get-video-id";

export const addVideoPreviewEvent = () => {
    const urlInput = document.getElementById('video-src-input');
    const previewContainer = document.querySelector('#video-frame');

    // Event listener for input change
    urlInput.addEventListener('input', () => {
        const youtubeUrl = urlInput.value;
        const videoId = getVideoId(youtubeUrl).id;
        console.log(videoId)
        if (videoId) {
        previewContainer.setAttribute("src", `http://www.youtube.com/embed/${videoId}`)
        } else {
        previewContainer.setAttribute("src", "")
        }
    });

    // extract video ID from YouTube URL
    // function extractVideoId(url) {
    //     const regExp =
    //     /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|attribution_link\?.+watch\?v=)|youtu\.be\/)([-_a-zA-Z0-9]{11})/;
    //     const match = url.match(regExp);
    //     return match ? match[1] : null;
    // }
}