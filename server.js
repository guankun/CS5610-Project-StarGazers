var express = require('express');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');

var app = express();


// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'this is the secret',
    resave: true,
    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

require("./public/server.js")(app);

var port = process.env.PORT || 3001;
app.listen(port);

console.log("Application start at port " + port);
