const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const togeojson = require('togeojson');
const Mongo = require('./mongo.js');
const mongo = new Mongo();
const Route = require('./route.js');


let GraphQL = function () { };

GraphQL.prototype.schema = buildSchema(`
    type Query {
      hello: String,
      tracks(type: String, year: String): [Track],
      track(_id: String!): Track,
      types: [String],
      years: [String]
    },
    type Track {
        name: String,
        _id: String,
        geojson: GeoJSON,
        type: String,
        length: Float
    },
    type GeoJSON {
        type: String,
        geometry: Geometry
    },
    type Geometry {
        type: String,
        coordinates: [[Float]]
    }
  `);

GraphQL.prototype.getters = {
    hello: () => {
        return 'world';
    },
    track: (args) => {
        return new Promise(function (resolve, reject) {
            mongo.find({ "_id": mongo.ObjectId(args._id) }, 'tracks')
                .then((resp) => { resolve({ type: resp[0].type, name: resp[0].name, _id: resp[0]._id, geojson: resp[0].data[0], length: new Route(resp[0].data[0]).getLength() });})
                .catch((err) => { console.log(err); reject(err) });
        });
    },
    tracks: (filters) => {
        return new Promise(function (resolve, reject) {
            mongo.aggregate([{ "$match": filters }, { "$project": { "name": 1, "type": 1 } }], 'tracks')
                .then((resp) => { resolve(resp.map((el) => { return { name: el.name, _id: el._id, type: el.type, geojson: {type:"Possible only to specific id!"} } })); })
                .catch((err) => { reject(err); });
        });
    },
    types: () => {
        return new Promise(function (resolve, reject) {
            mongo.distinct("type", 'tracks')
                .then((resp) => { resolve(resp); })
                .catch((err) => { reject(err); });
        });
    },
    years: () => {
        return new Promise(function (resolve, reject) {
            mongo.distinct("year", 'tracks')
                .then((resp) => { resolve(resp); })
                .catch((err) => { reject(err); });
        });
    }
};

module.exports = GraphQL;

