/* Global Variables */
const apiKey = "87f0f6ef886a8b587936aaabca02febc";

const baseURL = "http://api.openweathermap.org/data/2.5/weather";

document.getElementById('generate').addEventListener('click', performAction);

// Write an async function in app.js that uses fetch() to make a GET request to the OpenWeatherMap API.
function performAction(e) {
    const zip = document.getElementById('zip').value;
    getWeather(zip)
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

const getWeather = async (zip) => {
    const res = await fetch(`${baseURL}?zip=${zip}&appid=${apiKey}&units=imperial`)
    try {
      const data = await res.json();
      console.log('inside getWeather', data);
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
