const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const openAi = require('./openAiConfig')
const firebaseConfig = require('./firebaseConfig.js')
const { initializeApp } = require('firebase/app');




// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  origin: 'https://cartami-frontend.onrender.com'
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function checkAndMakeAudioFileDirectory(req, res, next){
  const directoryPath = path.join(__dirname, '/public/downloaded_audio'); 
  console.log(directoryPath)
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
    console.log('Directory created successfully.');
  } else {
    console.log('Directory already exists.');
  }
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
