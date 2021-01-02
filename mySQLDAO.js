// Importing Promise-MySQL
var mysql = require('promise-mysql');

// Declaring pool
var pool

// MySQL Pool
mysql.createPool({
    connectionLimit : 3,
    host            : 'localhost',
    user            : 'root',
    password        : '1234',
    database        : 'geography'
    })
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
}); // MySQL Pool - END

// getCountries - Returning all countries
var getCountries = function() {
    // Return promise
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
        .then((result) => {
            resolve(result)
        }) // .then - END
        .catch((error) => {
            reject(error)
        }) // .catch - END
    }) // return - END
} // getCountries - END

// getCountry - Returning specific country using co_code
var getCountry = function(co_code) {
    // Return promise
    return new Promise((resolve, reject) => {
        // Declaring myQuery
        var myQuery = {
            sql: 'select * from country where co_code = ?',
            values: [co_code]
        } // myQuery - END
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            }) // .then - END
            .catch((error) => {
                reject(error)
            }) // .catch - END
    }) // return  - END
} // getCountry - END

// deleteCountry - Deleting country using co_code
var deleteCountry = function(co_code) {
    // Return promise
    return new Promise((resolve, reject) => {
        // Declaring myQuery
        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [co_code]
        } // myQuery - END
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            }) // .then - END
            .catch((error) => {
                reject(error)
            }) // .catch - END
    }) // return  - END
} // deleteCountry - END

// updateCountry - Updating Country using co_code, co_name, co_details
var updateCountry = function(co_code, co_name, co_details) {
    // Returning promise
    return new Promise((resolve, reject) => {
        // Declaring myQuery
        var myQuery = {
            sql: 'update country set co_name=?, co_details=? where co_code=?',
            values: [co_name, co_details, co_code]
        } // myQuery - END
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            }) // .then - END
            .catch((error) => {
                reject(error)
            }) // .catch - END
    }) // return - END
} // updateCountry - END

// addCountry - Adding Country using co_code, co_name, co_details
var addCountry = function(co_code, co_name, co_details) {
    // Return the promise
    return new Promise((resolve, reject) => {
        // Declare myQuery
        var myQuery = {
            sql: 'insert into country values (?, ?, ?)',
            values: [co_code, co_name, co_details]
        } // myQuery - END
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            }) // .then - END
            .catch((error) => {
                reject(error)
            }) // .catch - END
    }) // return - END
} // addCountry - END

// isCountryCodeUsed - Checking to see if country is already in database
var isCountryCodeUsed = function(co_code){
    // Return the promise
    return new Promise((resolve,reject) => {
        pool.query('select count(*) as total from country where co_code = ?',
        [co_code], function(error, result, fields){
            // Check for error
            if(!error){
                // Return result
                return resolve(result[0].total > 0);
            } else {
                // Return error
                return reject(new Error('ERROR'));
            } // If - Else - END
        }); // pool.query - END
    }) // return - END
} // isCountryCodeUsed - END

// getCities - Getting all cities back
var getCities = function() {
    // Return the promise
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
        .then((result) => {
            resolve(result)
        }) // .then - END
        .catch((error) => {
            reject(error)
        }) // .catch - END
    }) // return - END
} // getCities - END

// getAllCityDetails - Getting specific city details using cty_code
var getAllCityDetails = function(cty_code) {
    // Return the promise
    return new Promise((resolve, reject) => {
        // Declare myQuery
        var myQuery = {
            // Left JOINing country with city, country code
            sql: 'SELECT * FROM city LEFT JOIN country ON city.co_code = country.co_code WHERE cty_code = ?',
            values: [cty_code]
        } // myQuery - END
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            }) // .then - END
            .catch((error) => {
                reject(error)
            }) // .catch - END
    }) // return  - END
} // getAllCityDetails - END

// Exports
module.exports = { getCountries, getCountry, deleteCountry, updateCountry, addCountry, isCountryCodeUsed, getCities, getAllCityDetails }