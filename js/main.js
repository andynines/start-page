/*
main.js
*/

// Globals

const timeElem = document.getElementById("time-text");
const greetingVocab = {
	5: 	"Go to bed",
	11: "Good morning",
	16: "Good afternoon",
	23: "Good evening",
};

var now;

// Format functions

function padNumber(n) {
	return ("00" + n).slice(-2);
}

function toFahrenheit(t) {
	return Math.round(((parseFloat(t) - 273.15) * 1.8) + 32);
}

function capitalize(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

// Main function helpers

function writeTime() {
	timeElem.innerHTML =
			padNumber(now.getHours()) + ':' + padNumber(now.getMinutes());
}

function updateClock() {
	var newNow = new Date();
	if ((now.getMinutes() + 1) % 60 == newNow.getMinutes()) {
		now = newNow;
		writeTime();
	}
}

function getNearestForecast(apiList, targetTime) {
	var listElem;
	for (var i in apiList) {
		listElem = apiList[i];
		// Fetches forecast for the first time that hasn't past already
		// Need to adjust API dt values to compare with JS's: s -> ms
		if (new Date(listElem.dt * 1000) > targetTime) {
			return listElem;
		}
	}
}

// Main writing functions

function writeGreetingText() {
	var currentHour = now.getHours();
	for (var hourThresh in greetingVocab) {
		if (currentHour <= hourThresh) {
			document.getElementById("greeting-text").innerHTML =
				greetingVocab[hourThresh] + ", " + window.masterName + '.';
			break;
		}
	}
}

function writeWeatherInfo() {
	fetch(
		"https://api.openweathermap.org/data/2.5/forecast?" +
		"zip=" + window.zipCode +
		"&appid=" + window.apiKey
	)
	.then(resp => resp.json())
	.then(function(data) {
		if (typeof data === "undefined" || data.cod != "200") return;
		// Write today's forecast
		var todayForecast = getNearestForecast(data.list, now);
		document.getElementById("weather-today-temp").innerHTML =
			toFahrenheit(todayForecast.main.temp) + "&deg;";
		document.getElementById("weather-today-desc").innerHTML =
			capitalize(todayForecast.weather[0].description);
		// Write tomorrow's forecast
		var tomorrowForecast = getNearestForecast(
			data.list, now.setHours(now.getHours() + 24)
		);
		document.getElementById("weather-tomorrow-temp").innerHTML =
			toFahrenheit(tomorrowForecast.main.temp) + "&deg;";
		document.getElementById("weather-tomorrow-desc").innerHTML =
			capitalize(tomorrowForecast.weather[0].description);
		// Display weather divs
		var weatherDivs = document.getElementsByClassName("weather-div");
		weatherDivs[0].style.display = "";
		weatherDivs[1].style.display = "";
		// Write city text and display it
		var locationElem = document.getElementById("city-text");
		locationElem.innerHTML = "@ " + data.city.name;
		locationElem.style.display = "";
	});
}

function writeOptionElements() {
	chrome.storage.sync.get({
		"masterName": "Human",
		"zipCode": "19104",
		"apiKey": -1
	}, function(data) {
		window.masterName = data.masterName;
		window.zipCode = data.zipCode;
		window.apiKey = data.apiKey;
		writeGreetingText();
		writeWeatherInfo();
	});
}

function main() {
	now = new Date();
	writeTime();
	window.setInterval(updateClock, 1000);
	writeOptionElements();
}

window.addEventListener("load", main);
