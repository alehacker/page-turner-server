var express = require('express');
var createError = require("http-errors");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors')

var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth')
var booksRouter = require('./routes/books')
var bookClubsRouter = require('./routes/bookClubs')



var app = express();

//For Deployment
app.set('trust proxy', 1);
app.enable('trust proxy');

app.use(logger('dev'));
app.use(express.json());
app.use(
   cors({
     origin: process.env.FRONTEND_URI,
     credentials: true,  // <== URL of our future React app
   })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(
//    cors()
// );


app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/bookclubs', bookClubsRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
   next(createError(404));
 });


mongoose
   .connect(process.env.MONGODB_URI)
   .then((x) => {
   console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
   })
   .catch((err) => {
   console.error("Error connecting to mongo: ", err);
   });

module.exports = app;
