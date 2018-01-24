var Router = function(app) {
    app.get('/', function(req, res) {
        var sess = req.session;
        if (!sess.counter) {
            sess.counter = 1;
            res.send('Hello world!');
        } else {
            sess.counter++;
            res.render('index.html');
        }
    });

    app.get('/src/*', function(req, res) {
        var fs = require('fs');
        var fileName = req.originalUrl;
        fs.readFile(__dirname + req.originalUrl, function(err, data) {
            if (typeof data === 'undefined') {
                res.status(404);
                console.log(fileName + " not found");
            } else {
                if (fileName.slice(-3) === "css") {
                    res.setHeader('content-type', 'text/css');
                    res.end(data.toString());
                } else if (fileName.slice(-4) === "woff" || fileName.slice(-5) === "woff2") {
                    res.setHeader('content-type', 'text/woff');
                    res.end(data);
                } else if (fileName.slice(-3) === "png") {
                    res.setHeader('content-type', 'image/png');
                    res.end(data);
                } else if (fileName.slice(-3) === "ttf") {
                    res.setHeader('content-type', 'application/octet-stream');
                    res.end(data);
                } else {
                    res.setHeader('content-type', 'plain/text');
                    res.end(data);
                }
            }
        });
    });
}
module.exports = Router;
