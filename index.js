const textBox = document.getElementById("textBox");
const toFahrenheit = document.getElementById("toFahrenheit");
const toCelsius = document.getElementById("toCelsius");
const result = document.getElementById("result");
const locationElement = document.getElementById("location");
const currentTemp = document.getElementById("currentTemp");

let temp;
function convert(event) {
    event.preventDefault();
    if (toFahrenheit.checked) {
        temp = Number(textBox.value);
        temp = temp * 9 / 5 + 32;
        result.textContent = temp.toFixed(1) + "℉";
    } else if (toCelsius.checked) {
        temp = Number(textBox.value);
        temp = (temp - 32) * (5/9);
        result.textContent = temp.toFixed(1) + "℃";
    } else {
        result.textContent = "Select a Unit";
    }
}

function fetchCurrentTemperature(lat, lon) {
    const apiKey = '59458c8e44f4a64512242d974dc8c31c'; // New API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    console.log(`Fetching temperature for lat: ${lat}, lon: ${lon}`);
    console.log(`API URL: ${url}`);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Temperature data received:', data);
            locationElement.textContent = `Location: ${data.name}`;
            currentTemp.textContent = `Current Temperature: ${data.main.temp}℃`;
        })
        .catch(error => {
            console.error('Error fetching temperature data:', error);
            locationElement.textContent = 'Unable to fetch location';
            currentTemp.textContent = 'Unable to fetch temperature';
        });
}

function getLocation() {
    if (navigator.geolocation) {
        console.log('Geolocation supported. Fetching current position...');
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(`Current position: lat=${lat}, lon=${lon}`);
                fetchCurrentTemperature(lat, lon);
            },
            error => {
                console.error('Geolocation error:', error);
                locationElement.textContent = 'Location access denied';
                currentTemp.textContent = 'Unable to fetch temperature';
            }
        );
    } else {
        console.error('Geolocation not supported by this browser.');
        locationElement.textContent = 'Geolocation not supported';
        currentTemp.textContent = 'Unable to fetch temperature';
    }
}

document.addEventListener('DOMContentLoaded', getLocation);
