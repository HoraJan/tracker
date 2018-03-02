const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(session({ secret: 'hrozne-moc-dlouhy-heslo-pro-soukromou-session', resave: true, saveUninitialized: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = require('./router.js')(app);

app.set('views', __dirname + '/src');
app.engine('html', require('ejs').renderFile);

const port = process.env.NODE_PORT || 3000;
const server = app.listen(port, function() {
    console.log("Tracker is started on port 3000");
});
