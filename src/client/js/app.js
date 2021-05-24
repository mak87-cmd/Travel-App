/* Global Variables */
const geonamesBaseUrl = 'http://api.geonames.org/';
const weatherbitBaseUrlCurrent = 'http://api.weatherbit.io/v2.0/current';
const weatherbitBaseUrlFuture = 'http://api.weatherbit.io/v2.0/forecast/daily';
const pixabayBaseUrl = 'https://pixabay.com/api/';

async function performAction(e) {
    const userCity = document.getElementById('city').value;
    const cityData = await getCity(userCity);
    const city = cityData.geonames[0].name;
    const startDate = document.getElementById('start').value;
    const endDate = document.getElementById('end').value;
    const lengthOfTrip = diffBetweenDates(startDate, endDate);
    const weather = await getWeather(city, startDate);
    const image = await getImage(city);
    await postData('/addTrip', {city, startDate, endDate, lengthOfTrip, weather, image});
    updateUI();
}

const getCity = async (city) => {
    const res = await fetch(`${geonamesBaseUrl}searchJSON?q=${city}&maxRows=10&username=mak87`);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
}

const getWeather = async (city, date) => {
    const now = Date.now();
    const diff = diffBetweenDates(now, date);
    const isCurrent = diff < 7;
    const apiUrl = isCurrent ? weatherbitBaseUrlCurrent : weatherbitBaseUrlFuture;
    const res = await fetch(`${apiUrl}?key=403d10bec1b34b16b33bf36cba9fe695&city=${city}&units=I`);
    try {
        const data = await res.json();
        let weather;
        if (isCurrent) {
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
        document.getElementById('destination').innerHTML = `City: ${projectData.city}`;
        document.getElementById('start-date').innerHTML = `Start Date: ${projectData.startDate}`;
        document.getElementById('end-date').innerHTML = `End Date: ${projectData.endDate}`;
        document.getElementById('length-of-trip').innerHTML = `Length of Trip: ${projectData.lengthOfTrip}`;
        if (projectData.weather.temp) {
            document.getElementById('temp').innerHTML = `Current Temperature: ${projectData.weather.temp}`;
        } else {
            document.getElementById('low-temp').innerHTML = `Low Temperature: ${projectData.weather.lowTemp}`;
            document.getElementById('high-temp').innerHTML = `High Temperature: ${projectData.weather.highTemp}`;
        }
        document.getElementById('description').innerHTML = `Forecast Conditions: ${projectData.weather.description}`;
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
        return newData;
    } catch (error) {
        console.log('error', error);
    }
}

const diffBetweenDates = (startDate, endDate) => {
    return Math.floor(( Date.parse(endDate) - Date.parse(startDate) ) / 86400000);
}

module.exports = { performAction }