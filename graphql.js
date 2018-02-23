const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const togeojson = require('togeojson');
var Mongo = require('./mongo.js');
let mongo = new Mongo();

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
        data: String,
        type: String
    }
  `);

GraphQL.prototype.root = {
    hello: () => {
        return 'world';
    },
    track: (args) => {
        console.log(args);
        return new Promise(function (resolve, reject) {
            mongo.find({ "_id": mongo.ObjectId(args._id) }, 'tracks')
                .then((resp) => { resolve({ name: resp[0].name, _id: resp[0]._id, data: JSON.stringify(resp[0].data[0]) }); })
                .catch((err) => { reject(err) });
        });
    },
    tracks: (args) => {
        return new Promise(function (resolve, reject) {
            let match = {};
            if (args) {
                match = args;
            }
            mongo.aggregate([{ "$match": match }, { "$project": { "name": 1 } }], 'tracks')
                .then((resp) => { resolve(resp.map((el) => { return { name: el.name, _id: el._id } })); })
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

