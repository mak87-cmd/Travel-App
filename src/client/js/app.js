/* Global Variables */
const geonamesBaseUrl = 'http://api.geonames.org/';
const weatherbitBaseUrl = 'http://api.weatherbit.io';
const weatherbitBaseUrlCurrent = 'http://api.weatherbit.io/v2.0/current';
const weatherbitBaseUrlFuture = 'http://api.weatherbit.io/v2.0/forecast/daily';
// https://pixabay.com/api/?key=21439262-38bf3d4bd5afe814d508e3e61&q=london
const pixabayBaseUrl = 'https://pixabay.com/api/';
// document.getElementById('generate').addEventListener('click', performAction);

// Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API.
function performAction(e) {
    const city = document.getElementById('city').value;
    console.log('city...', city);
    getCity(city)
        .then(async function(data) {
            console.log('inside performAction', data)
            const city = data.geonames[0].name;
            console.log('city...', city);
            const date = document.getElementById('start').value;
            console.log('date...', date);
            const weather = await getWeather(city, date);
            console.log('weather', weather);
            const image = await getImage(city);
            console.log('image...', image);
            // getImage(city)
            //   postData('/addWeatherJournal', {temperature: data.main.temp, date: newDate, userResponse: feelings});
      })
    
      .then(updateUI())
}

const getCity = async (city) => {
    const res = await fetch(`${geonamesBaseUrl}searchJSON?q=${city}&maxRows=10&username=mak87`)
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
}

const getWeather = async (city, date) => {
    const diff =  Math.floor(( Date.parse(date) - Date.now() ) / 86400000);
    const apiUrl = diff < 7 ? weatherbitBaseUrlCurrent : weatherbitBaseUrlFuture;
    const res = await fetch(`${apiUrl}?key=403d10bec1b34b16b33bf36cba9fe695&city=${city}`)
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
}

const getImage = async (city) => {
    const res = await fetch(`${pixabayBaseUrl}?key=21439262-38bf3d4bd5afe814d508e3e61&q=${city}`);
    try {
        const data = await res.json();
        const image = data.hits[0].largeImageURL;
        return image;
    } catch (error) {
        console.log('error', error);
    }
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