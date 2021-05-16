/* Global Variables */
const geonamesBaseUrl = 'http://api.geonames.org/';
const weatherbitBaseUrl = 'http://api.weatherbit.io';
const weatherbitBaseUrlCurrent = 'http://api.weatherbit.io/v2.0/current';
const weatherbitBaseUrlFuture = 'http://api.weatherbit.io/v2.0/forecast/daily';
// https://pixabay.com/api/?key=21439262-38bf3d4bd5afe814d508e3e61&q=london
const pixabayBaseUrl = 'https://pixabay.com/api/';
// document.getElementById('generate').addEventListener('click', performAction);

// Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API.
async function performAction(e) {
    const userCity = document.getElementById('city').value;
    console.log('userCity...', userCity);
    const cityData = await getCity(userCity);
    console.log('cityData...', cityData);
    const city = cityData.geonames[0].name;
    console.log('city...', city);
    const startDate = document.getElementById('start').value;
    console.log('startDate...', startDate);
    const endDate = document.getElementById('end').value;
    console.log('end date', endDate);
    const lengthOfTrip = diffBetweenDates(startDate, endDate);
    console.log('length of trip', lengthOfTrip);
    const weather = await getWeather(city, startDate);
    console.log('weather', weather);
    const image = await getImage(city);
    console.log('image...', image);
    await postData('/addTrip', {city, startDate, endDate, lengthOfTrip, weather, image});
    console.log('after postData');
    updateUI();
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
    // const diff =  Math.floor(( Date.parse(date) - Date.now() ) / 86400000);
    const now = Date.now();
    const diff = diffBetweenDates(now, date);
    const isCurrent = diff < 7;
    const apiUrl = isCurrent ? weatherbitBaseUrlCurrent : weatherbitBaseUrlFuture;
    const res = await fetch(`${apiUrl}?key=403d10bec1b34b16b33bf36cba9fe695&city=${city}&units=I`)
    try {
        const data = await res.json();
        let weather;
        if (isCurrent) {
            console.log('inside getWeather', data.data[0]);
            weather = {
                temp: data.data[0].temp,
                description: data.data[0].weather.description
            }
        } else {
            weather = {
                lowTemp: data.data[15].low_temp,
                highTemp: data.data[15].high_temp,
                description: data.data[15].weather.description
            }
        }
        return weather;
    } catch (error) {
        console.log('error', error);
    }
}

const getImage = async (city) => {
    const res = await fetch(`${pixabayBaseUrl}?key=21439262-38bf3d4bd5afe814d508e3e61&q=${city}`);
    try {
        const data = await res.json();
        const image = data.hits[0].webformatURL;
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
        console.log('projectData...', projectData);
        document.getElementById('destination').innerHTML = projectData.city;
        document.getElementById('start-date').innerHTML = projectData.startDate;
        document.getElementById('end-date').innerHTML = projectData.endDate;
        document.getElementById('length-of-trip').innerHTML = projectData.lengthOfTrip;
        document.getElementById('low-temp').innerHTML = projectData.weather.lowTemp || projectData.weather.temp;
        if (projectData.weather.highTemp) {
            document.getElementById('high-temp').innerHTML = projectData.weather.highTemp;
        }
        document.getElementById('description').innerHTML = projectData.weather.description;
        const existingImage = document.getElementById('search-image-result');
        if (existingImage) {
            existingImage.remove();
        }
        const img = document.createElement('img');
        img.src = projectData.image;
        img.id = 'search-image-result';
        document.getElementById('image').appendChild(img);
    } catch (error) {
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
        return newData
    } catch (error) {
        console.log('error', error);
    }
}

const diffBetweenDates = (startDate, endDate) => {
    return Math.floor(( Date.parse(endDate) - Date.parse(startDate) ) / 86400000);
}

module.exports = { performAction }