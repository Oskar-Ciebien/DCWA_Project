// Imports
var express = require('express');
var mySQLDAO = require('./mySQLDAO');
var mongoDAO = require('./mongoDAO');
var bodyParser = require('body-parser');
const { validationResult, check } = require('express-validator');

// Declare express as app
var app = express()

// Set the view engine to ejs
app.set('view engine', 'ejs')

// Body Parser
app.use(bodyParser.urlencoded({
    extended: false
})); // app.use(bodyParser.urlencoded - END

// Home Page
app.get('/', (req, res) => {
    // Send out links to other pages
    res.send("<a href='/listCountries'>List Countries</a> </br> <a href='/listCities'>List Cities</a> </br> <a href='/listHeadsOfState'>List Heads of State</a>")
}) // Home Page - END

// /listCountries Page
app.get('/listCountries', (req, res) => {
    // Calls getCountries
    mySQLDAO.getCountries()
        .then((result) => {
            res.render('listCountries', { countries: result })
        }) // .then - END
        .catch((error) => {
            res.send(error)
        }) // .catch - END
}) // /listCountries - GET - END

// /edit/:co_code Page - GET
app.get('/edit/:co_code', (req, res) => {
    // Calls getCountry with co_code
    mySQLDAO.getCountry(req.params.co_code)
        .then((result) => {
            res.render('updateCountries', { countries: result })
        }) // .then - END
        .catch((error) => {
            res.send(error)
        }) // .catch - END
}) // /edit/:co_code - GET - END

// /edit - POST
app.post('/edit', (req, res) => {
    // Declaring temp and setting it to co_name
    var tempVar = req.body.co_name;
    // Checking if name is less than or equal to 0
    if (tempVar.length <= 0) {
        // Send out error message and button to go back
        res.send("<h1>Name Cannot Be Empty!</h1><br><a href='/'>Home</a>")
    } else {
        // Calling updateCountry
        mySQLDAO.updateCountry(req.body.co_code, req.body.co_name, req.body.co_details)
            .then((result) => {
                res.redirect("/listCountries")
            }) // .then - END
            .catch((error) => {
                res.send(error)
            }) // .catch - END
    } // If - Else - END
}) // /edit - POST - END

// /addCountry Page - GET
app.get('/addCountry', (req, res) =>{
    res.render("addCountry", {errors:undefined})
}) // /addCountry - GET - END

// /addCountry - POST
app.post('/addCountry', 
    // Checks if country code is between 1 and 3 in length
    [check('co_code').isLength({min:1, max: 3}).withMessage("Country Code must be 3 characters!"),
        // Checks if country name is greater than or equal to 3 characters
        check('co_name').isLength({min:3}).withMessage("Country Name must be at least 3 characters!"),
        // Checks if country code is already in the database
        check('co_code')
        .exists()
        .custom(async co_code => {
            // Calls isCountryCodeUsed to check if code is already in database
            const value = await mySQLDAO.isCountryCodeUsed(co_code);
            if (value) {
                // If it is, send out an error message
                throw new Error('ERROR: ' + co_code + ' already exists in the database!')
            } // If - END
        }) // Check for Database - END
     .withMessage('ERROR: Country already exists in the database!')
    ], // Checks - END
    (req,res) => {
        // Sets validationResult to errors
        var errors = validationResult(req)
        // Checks if it is not empty
        if(!errors.isEmpty()) {
            res.render("addCountry", {errors:errors.errors})
            // Informs about the error in the adding process
            console.log("ERROR: Adding new country was not successful!")
        } else { // Otherwise add the specified country into the database and returns user to /listCountries page
            mySQLDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
            res.redirect("/listCountries")
        } // If - Else - END
}) // /addCountry - POST - END

// /delete/:country - GET
app.get('/delete/:country', (req, res) => {
    // Calling deleteCountry
    mySQLDAO.deleteCountry(req.params.country)
        .then((result) => {
            // If no rows were affected inform user that country doesn't exist and show "Home" button
            if (result.affectedRows == 0) {
                res.send("<h4>Country: " + req.params.country + " doesn't exist!</h4></br><a href='/'>Home</a>")
            } else {
                // Otherwise delete country and show "Home" button
                res.send("<h4>Country: " + req.params.country + " deleted!</h4></br><a href='/'>Home</a>")
            } // If - Else - END
        }) // .then - END
        .catch((error) => {
            // Send the error code (if row is referenced) and inform user that the country has associated cities and cannot be deleted and show "Home" button
            res.send("<h1>Error Message</h1> <br><br> <h2>" + req.params.country + " has cities, it cannot be deleted.</h2></br><a href='/'>Home</a>")
        }) // .catch - END
}) // /delete/:country - GET - END

// /listCities Page - GET
app.get('/listCities', (req, res) => {
    // Calling getCities
    mySQLDAO.getCities()
        .then((result) => {
            res.render('listCities', { cities: result })
        }) // .then - END
        .catch((error) => {
            res.send(error)
        }) // .catch - END
}) // /listCities - GET - END

// /cityDetails/:cty_code - GET
app.get('/cityDetails/:cty_code', (req, res) => {
    // Calls getAllCityDetails
    mySQLDAO.getAllCityDetails(req.params.cty_code)
        .then((result) => {
            res.render('allCityDetails', { cities: result })
        }) // .then - END
        .catch((error) => {
            res.send(error)
        }) // .catch - END
}) // /cityDetails/:cty_code - GET - END

// /listHeadsOfState Page - GET
app.get('/listHeadsOfState', (req, res) => {
    // Calling getHeadsOfState
    mongoDAO.getHeadsOfState()
        .then((documents) => {
            res.render('listHeadsOfState', { headsOfState: documents })
        }) // .then - END
        .catch((error) => {
            res.send(error)
        }) // .catch - END
}) // /listHeadsOfState - GET - END

// /addHeadOfState GET
app.get('/addHeadOfState', (req, res) => {
    res.render("addHeadOfState")
}) // /addHeadOfState - GET - END

// /addHeadOfState - POST
app.post('/addHeadOfState', (req, res) => {
    // Calling addHeadOfState
    mongoDAO.addHeadOfState(req.body._id, req.body.headOfState)
        .then((result) => {
            res.redirect('/listHeadsOfState')
        }) // .then - END
        .catch((error) => {
            res.send(error)
        }) // .catch - END
}) // /addHeadOfState - POST - END

// listen
app.listen(3000, () => {
    console.log("Listening on Port 3000")
}) // listen - END
