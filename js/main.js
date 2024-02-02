const API_KEY = '8130f1c36419b51fd85eeb6b874e6f3a';
const form = document.querySelecor('#form');
const input = document.querySelecor('selector');

form.onsubmit = submitHandler;

async function submitHandle (e) {
    e.preventDefault();
    if (!input.value.trim()) {
        console.log('Enter City name');
        return 
    }

    const cityName = input.value.trim();
    input.value = '';

    //console.log(input.value.trim());
    const cityInfo = await getGeo(input.value.trim());
    //console.log(cityInfo[0]);
    //console.log(cityInfo[0]['lat']);
    //console.log(cityInfo[0]['lon']);

    if (!cityInfo.length) {
        return
    }

    const weatherInfo = await getWeather(cityInfo[0]['lat'], cityInfo[0]['lon']);
    console.log(weatherInfo);

    /*console.log(weatherInfo.name);
    console.log(weatherInfo.main.temp);
    console.log(weatherInfo.main.humidity);
    console.log(weatherInfo.wind.speed);
    console.log(weatherInfo.weather.main);
    console.log(weatherInfo.weather[0]['main']);*/

    const weatherData = {
        name: weatherInfo.name,
        temp: weatherInfo.main.temp,
        humidity: weatherInfo.main.humidity,
        speed:   weatherInfo.wind.speed,
        main: weatherInfo.weather[0]['main']
    };
    renderWeatherData(weatherData);
}

async function getGeo (name) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;
    const response = await fetch(geoUrl);
    const data = await response.json();
    //console.log(data);
    return data;
}

async function getWeather (lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    return data;
}

function renderWeatherData (data) {

    document.querySelector('.weather__info').classList.remove('none');
    document.querySelector('.weather__details').classList.remove('none');

    const temp = document.querySelector('.weather__temp');
    const city = document.querySelector('.weather__city');
    const humidity = document.querySelector('#humidity');
    const speed = document.querySelector('#speed');
    const img = document.querySelector('.weather__img');

    temp.innerText = data.temp + 'C';
    city.innerText = data.name;
    humidity.innerText = data.humidity + '%';
    speed.innerText = data.speed + 'kmph';

    const fileNames = {
        'Clouds': 'clouds',
        'Clear': 'clear',
        'Rain': 'rain',
        'Mist': 'mist',
        'Drizzle': 'drizzle'
    }

    if (fileNames[data.main]) {
        img.src = `./img/weather/${fileNames[data.main]}.png`;
    }
}