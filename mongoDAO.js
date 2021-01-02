// Import
const MongoClient = require('mongodb').MongoClient;

// Url to MongoDB
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'headsOfStateDB'

// Collection Name
const collName = 'headsOfState'

// Variables
var headsOfStateDB
var headsOfState

// Mongo Connect
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((client) => {
        headsOfStateDB = client.db(dbName)
        headsOfState = headsOfStateDB.collection(collName)
    }) // .then - END
    .catch((error) => {
        console.log(error)
    }) // .catch - END
   
// getHeadsOfState
var getHeadsOfState = function() {
    return new Promise((resolve, reject) => {
        // Declaring cursor
        var cursor = headsOfState.find()
        // Setting it toArray
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            }) // .then - END
            .catch((error) => {
                reject(error)
            }) // .catch - END
    }) // return - END
} // getHeadsOfState - END

// addHeadOfState
var addHeadOfState = function(_id, headOfState) {
    // Return promise
    return new Promise((resolve, reject) => {
        // Add new element to database
        headsOfState.insertOne({"_id":_id, "headOfState":headOfState})
            .then((result) => {
                resolve(result)
            }) // .then - END
            .catch((error) => {
                reject(error)
            }) // .catch - END
    }) // return - END
} // addHeadOfState - END

// Exports
module.exports = { getHeadsOfState, addHeadOfState }