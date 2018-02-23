var Mongo = function () {
    this.MongoClient = require('mongodb').MongoClient;
    this.ObjectId = require('mongodb').ObjectID;
    this.url = 'mongodb://admin:tracker@tracker-shard-00-00-v9ze1.mongodb.net:27017/test?ssl=true&replicaSet=Tracker-shard-0&authSource=admin';
    this.dbName = 'Tracker';
    this.coonection = null;
    this.db = null;
    let that = this;
    this.MongoClient.connect(this.url, function (err, client) {
        console.log("Connected successfully to server");
        that.connection = client;
        that.db = that.connection.db(that.dbName);
    });
};

Mongo.prototype.find = function (string, collectionName) {
    var that = this;
    return new Promise(function (resolve, reject) {
        console.log("Query - ", string);

        const collection = that.db.collection(collectionName);

        collection.find(string).toArray(function (err, docs) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("Found the following records", docs.length);
                resolve(docs);
            }
        });
    });
}

Mongo.prototype.aggregate = function (string, collectionName) {
    var that = this;
    return new Promise(function (resolve, reject) {
        console.log("Query - ", string);

        const collection = that.db.collection(collectionName);

        collection.aggregate(string).toArray(function (err, docs) {
            if (err) {
                reject(err);
            } else {
                console.log("Found the following records", docs.length);
                resolve(docs);
            }
        });
    });
}

Mongo.prototype.insertMany = function (rows, collectionName) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.MongoClient.connect(that.url, function (err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected successfully to server - ", rows);

                const db = client.db(that.dbName);
                const collection = db.collection(collectionName);

                collection.insertMany(rows).then(function (docs) {
                    console.log("Inserted following records", docs.length);
                    client.close();
                    resolve(docs);
                }).catch(function (error) { reject(error); })
            }
        });
    });
}

Mongo.prototype.deleteMany = function (rows, collectionName) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.MongoClient.connect(that.url, function (err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected successfully to server - ", rows);

                const db = client.db(that.dbName);
                const collection = db.collection(collectionName);

                collection.deleteMany(rows).then(function (docs) {
                    console.log("Deleted following records", docs.length);
                    client.close();
                    resolve(docs);
                }).catch(function (error) { reject(error); })
            }
        });
    });
}

Mongo.prototype.distinct = function (rows, collectionName) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.MongoClient.connect(that.url, function (err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected successfully to server - ", rows);

                const db = client.db(that.dbName);
                const collection = db.collection(collectionName);

                collection.distinct(rows).then(function (docs) {
                    console.log("Find Uniques following records", docs.length);
                    client.close();
                    resolve(docs);
                }).catch(function (error) { reject(error); })
            }
        });
    });
}

module.exports = Mongo;