const Import = function (app) {

    const DOMParser = require('xmldom').DOMParser;
    const togeojson = require('togeojson');
    const fs = require('fs');
    var Mongo = require('./mongo.js');
    let mongo = new Mongo();

    app.get('/save-to-mongo', function (req, res) {
        fs.readdir('./new/', (err, files) => {
            if (err) { reject(err); }
            else {
                let promiseArr = files.map((name) => {
                    return new Promise(function (resolve, reject) {
                        fs.readFile(__dirname + '/new/' + name, function (err, data) {
                            if (err) {
                                reject(err);
                            } else {
                                var gpx = new DOMParser().parseFromString(data.toString());
                                let convert = togeojson.gpx(gpx);
                                console.log(data.length, JSON.stringify(convert).length);
                                resolve({ name: name, type: name.split('-')[2].split('.')[0], data: convert.features });
                            }
                        });
                    });
                });
                Promise.all(promiseArr)
                    .then((geojsons) => {
                        mongo.insertMany(geojsons, 'tracks');
                        res.send(geojsons);
                    })
                    .catch((err) => console.log(err));
            }
        });
    });
}

module.exports = Import;