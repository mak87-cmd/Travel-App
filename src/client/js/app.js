/* Global Variables */
const geonamesBaseUrl = "http://api.geonames.org/";
const weatherbitBaseUrl = "http://api.weatherbit.io";
const weatherbitBaseUrlCurrent = "http://api.weatherbit.io/v2.0/current";
const weatherbitBaseUrlFuture = "http://api.weatherbit.io/v2.0/forecast/daily";
// document.getElementById('generate').addEventListener('click', performAction);

// Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API.
function performAction(e) {
    const city = document.getElementById('city').value;
    console.log('city...', city);
    getCity(city)
      .then(function(data) {
          console.log('inside performAction', data)
          const city = data.geonames[0].name;
          console.log('city...', city);
          const date = document.getElementById('start').value;
          console.log('date...', date);
          getWeather(city, date);
        //   postData('/addWeatherJournal', {temperature: data.main.temp, date: newDate, userResponse: feelings});
      })
    
      .then(updateUI())
}

function getWeather(city, date) {
    const key = process.env.WEATHERBIT_API_KEY;
    const diff =  Math.floor(( Date.parse(date) - Date.now() ) / 86400000);
    const apiUrl = diff < 7 ? weatherbitBaseUrlCurrent : weatherbitBaseUrlFuture;
    fetch(`${apiUrl}?key=403d10bec1b34b16b33bf36cba9fe695&city=${city}`)
      .then(function(res) { return res.json() })
      .then(function(data) {
          console.log(data);
      })
      .catch(function(e) {
          console.log(e);
      })
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
    const res = await fetch(`${geonamesBaseUrl}searchJSON?q=${city}&maxRows=10&username=mak87`)
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