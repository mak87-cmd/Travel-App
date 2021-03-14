// Setup empty JS object to act as endpoint for all routes

const projectData = {};

const port = 8000;

const express = require('express');

const app = express();

const bodyParser = require('body-parser'); 

/* Middleware*/
//Here we are configuring express to use body-parser as middle-wares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const server = app.listen(port, listening);

function listening() {
    console.log("server running"); 
    console.log(`running on localhost: ${port}`);
}

app.get('/all', function (req, res) {
    res.send(projectData)
})

app.post('/addWeatherJournal', function (req, res) {
    projectData.temperature = req.body.temperature;
    projectData.date = req.body.date;
    projectData.userResponse = req.body.userResponse;
})
