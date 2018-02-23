var Router = function (app) {

    const fs = require('fs');
    const { buildSchema } = require('graphql');
    const graphqlHTTP = require('express-graphql');
    // const DOMParser = require('xmldom').DOMParser;
    // const togeojson = require('togeojson');
    // var Mongo = require('./mongo.js');
    // let mongo = new Mongo();

    const GraphQL = require('./graphql.js');
    let graphql = new GraphQL();

    app.get('/', function (req, res) {
        var sess = req.session;
        if (!sess.counter) {
            sess.counter = 1;
            res.send('Hello world!');
        } else {
            sess.counter++;
            res.render('index.html');
        }
    });

    // app.get('/save-to-mongo', function (req, res) {
    //     fs.readdir('./new/', (err, files) => {
    //         if (err) { reject(err); }
    //         else {
    //             let promiseArr = files.map((name) => {
    //                 return new Promise(function(resolve, reject) {
    //                     fs.readFile(__dirname + '/new/' + name, function (err, data) {
    //                         if (err) {
    //                             reject(err);
    //                         } else {
    //                             var gpx = new DOMParser().parseFromString(data.toString());
    //                             let convert = togeojson.gpx(gpx);
    //                             console.log(data.length, JSON.stringify(convert).length);
    //                             resolve({name: name, type: name.split('-')[2].split('.')[0], data: convert.features});
    //                         }
    //                     });
    //                 });
    //             });
    //             Promise.all(promiseArr)
    //             .then((geojsons) => {
    //                 mongo.insertMany(geojsons, 'tracks');
    //                 res.send(geojsons);
    //             })
    //             .catch((err) => console.log(err));
    //         }
    //     });
    //     // mongo.insertMany();
    // });



    app.use('/graphql', graphqlHTTP({
        schema: graphql.schema,
        rootValue: graphql.root,
        graphiql: false //Set to false if you don't want graphiql enabled
    }));

    app.get('/src/*', function (req, res) {
        var fileName = req.originalUrl;
        fs.readFile(__dirname + req.originalUrl, function (err, data) {
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
