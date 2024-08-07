const textBox = document.getElementById("textBox");
const toFahrenheit = document.getElementById("toFahrenheit");
const toCelsius = document.getElementById("toCelsius");
const result = document.getElementById("result");
const locationElement = document.getElementById("location");
const currentTemp = document.getElementById("currentTemp");
const locationInput = document.getElementById("locationInput");
const locationUpdateResult = document.getElementById("locationUpdateResult");
const form = document.getElementById("tempConversionForm");
const updateButton = document.querySelector("button[onclick='changeLocation()']");

// Function to convert temperature
function convert(event) {
    event.preventDefault(); // Prevent the default form submission
    let temp;
    const value = Number(textBox.value);

    if (toFahrenheit.checked) {
        temp = value * 9 / 5 + 32;
        result.textContent = temp.toFixed(1) + "℉";
    } else if (toCelsius.checked) {
        temp = (value - 32) * (5 / 9);
        result.textContent = temp.toFixed(1) + "℃";
    } else {
        result.textContent = "Select a Unit";
    }
}

// Function to fetch weather data using coordinates
function fetchCurrentTemperature(lat, lon) {
    const apiKey = '59458c8e44f4a64512242d974dc8c31c'; // API Key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            locationElement.textContent = `Location: ${data.name}`;
            currentTemp.textContent = `Current Temperature: ${data.main.temp}℃`;
            locationUpdateResult.textContent = ''; // Clear previous error message
        })
        .catch(error => {
            console.error('Error fetching temperature data:', error);
            locationElement.textContent = 'Unable to fetch location';
            currentTemp.textContent = 'Unable to fetch temperature';
        });
}

// Function to fetch coordinates for a specific location
function fetchCoordinates(location) {
    const apiKey = '59458c8e44f4a64512242d974dc8c31c'; // API Key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === "404") {
                throw new Error('Location not found');
            }
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            fetchCurrentTemperature(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
            locationUpdateResult.textContent = 'Unable to fetch temperature for the specified location. Please check the location name.';
        });
}

// Function to get current geolocation
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchCurrentTemperature(lat, lon);
            },
            error => {
                console.error('Geolocation error:', error);
                locationElement.textContent = 'Location access denied';
                currentTemp.textContent = 'Unable to fetch temperature';
            }
        );
    } else {
        locationElement.textContent = 'Geolocation not supported';
        currentTemp.textContent = 'Unable to fetch temperature';
    }
}

// Function to change location based on user input
function changeLocation() {
    const city = locationInput.value.trim();
    if (city) {
        locationUpdateResult.textContent = ''; // Clear any previous error message
        fetchCoordinates(city);
    } else {
        locationUpdateResult.textContent = 'Please enter a location name';
    }
}

// Add event listener for form submission
form.addEventListener('submit', function(event) {
    convert(event);
});

// Add event listener for button click
updateButton.addEventListener('click', changeLocation);

// Initialize location on page load
document.addEventListener('DOMContentLoaded', getLocation);
