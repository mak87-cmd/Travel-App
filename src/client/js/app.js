/* Global Variables */
const baseURL = "http://api.geonames.org/";

// document.getElementById('generate').addEventListener('click', performAction);

// Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API.
function performAction(e) {
    const city = document.getElementById('city').value;
    getCity(city)
      .then(function(data) {
          console.log('inside performAction', data)
          // Create a new date instance dynamically with JS
          const d = new Date();
          const newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
          const feelings = document.getElementById('feelings').value;
          postData('/addWeatherJournal', {temperature: data.main.temp, date: newDate, userResponse: feelings});
      })
      .then(updateUI())
}

const updateUI = async () => {
    // get the projectData from the server
    // then update the DOM with the values from projectData
    const request = await fetch('/all');
    try {
        const projectData = await request.json();
        document.getElementById('date').innerHTML = projectData.date;
        document.getElementById('temp').innerHTML = projectData.temperature;
        document.getElementById('content').innerHTML = projectData.userResponse;
    } catch(error) {
        console.log('error', error);
    }
}

const getCity = async (city) => {
    const res = await fetch(`${baseURL}search?q=${city}&maxRows=10&username=${username}`)
    try {
      const data = await res.json();
      console.log('inside getCity', data);
      const cityData = data.geonames[0];
      return data;
    } catch (error) {
      console.log("error", error);
    }
}

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    try {
        const newData = await response.json();
        console.log(newData);
        return newData
    } catch (error) {
        console.log('error', error);
    }
}

module.exports = { performAction }