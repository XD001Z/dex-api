var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var createError = require('http-errors');
var animeRouter = require('./routes/anime');
var authRouter = require('./routes/auth');
var seedRouter = require('./routes/seed');
var mongoose = require('mongoose');
var app = express();

app.set('trust proxy', 1);
app.enable('trust proxy');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use('/anime', animeRouter);
app.use('/auth', authRouter);
app.use('/seed', seedRouter);

///////////// Catch 404 and forward to handler /////////////
app.use(function(req, res, next) {
  next(createError(404));
});

/////////////////////// Error handler ///////////////////////
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

///////////////////// MongoDB connection /////////////////////
mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to Mongo: ", err);
  });

module.exports = app;
