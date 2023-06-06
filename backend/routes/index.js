const express = require('express');
const router = express.Router();
const { execSync, exec } = require('child_process')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const assemblyAiUpload = require('./transcribe')

//firebase imports:
const { initializeApp } = require('firebase/app');
const { ref, getStorage, uploadBytes }= require('firebase/storage')
const firebaseConfig = require('../firebaseConfig.js')

//firebase setup
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);


async function saveOneFile(fileName){
  fs.readFile(fileName, async (readError, fileData) => {
    if (readError) {
      console.error(`Error reading file: ${readError.message}`);
      return;
    }
    const audioRef = ref(storage, `downloaded_audio/${fileName}`);
    const metadata = {
      contentType: 'audio/mpeg',
    };
    await uploadBytes(audioRef, fileData, metadata).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

    console.log('File uploaded to Firebase Storage.');
    //return fileName
  });

}


function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Command execution error: ${error.message}`));
        return;
      }
      if (stderr) {
        reject(new Error(`yt-dlp encountered an error: ${stderr}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/key', (req, res, next) => {
  //res.send(`${process.env.FB_KEY}`)
  res.json({key: `${process.env.FB_KEY}`})
})

router.post('/download', async function(req, res, next){
  console.log('saving file....here\'s the request: ', {...req.body})
  //checkAndMakeAudioFileDirectory()
  const { id, url } = req.body
  const ext = 'mp3'
  const command = `yt-dlp -x -o /public/downloaded_audio/${id} --audio-format ${ext} ${url}`
  
  executeCommand(command)
  .then(async (result) => {
    const downloadedFilename = `${id}.${ext}`;
    const filePath = path.join(__dirname, '/../public/downloaded_audio')
    const resolvedFilePath = path.resolve(filePath, downloadedFilename)
    console.log(`Downloaded file: ${downloadedFilename}`);
    //~~function to save file to cloud~~//
    await saveOneFile(`${filePath}/${id}.${ext}`)
    const transcript = await assemblyAiUpload(resolvedFilePath)
    res.json({file: downloadedFilename, transcript })
  })
  .catch((error) => {
    console.error(error.message);
  });
})

module.exports = router;
