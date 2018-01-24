var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
app.use(session({ secret: 'hrozne-moc-dlouhy-heslo-pro-soukromou-session', resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = require('./router.js')(app);

app.set('views', __dirname + '/src');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function() {
    console.log("Tracker is started on port 3000");
});
