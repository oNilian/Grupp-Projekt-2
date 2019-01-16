const apiKey = 'f4757a7658010dcba84aece647fcc1f9';
const url = 'https://api.openweathermap.org/data/2.5/weather';
const settings = {
	method: 'GET',
	data: {
		q: '', // temp value should be set by cookie.
		units: 'metric',
		appid: apiKey
	},
}

$( document ).ready(() => {
//	console.log('weatherAPI.js loaded');
	// Get item from local storage
	//if(typeof data.sources == 'object')
//settings.data.q = localStorage.getItem('Location');
	let value = localStorage.getItem('Location');
	if( value !== null && value !== '' ) {
		settings.data.q = value
	//On page load add user location and new source to html.
} else {
	settings.data.q = 'Göteborg';
}

	loadAPIRequest();
	locationTextToInput();
});

function loadAPIRequest() {
	$.ajax(url, settings).done(getWeather);
	//neeed some type of error checkin to know that the data realy got worked. ;)
}

// Get wether data and weather icon
function getWeather (data) {

	let temp = data.main.temp;
	for (let i = 0; i < data.weather.length; i++) {
		let weatherArray = data.weather[i];
		let weatherCondition = weatherArray.description;
		let iconCondition = weatherArray.icon;
		let iconUrl = "http://openweathermap.org/img/w/" + iconCondition + ".png";
		$('#weatherText p').first().html(`Current temp: ${temp} °c,<br> and ${weatherCondition} in <a href="#" id="updateLocation">${settings.data.q}</a>`);
		$('#wicon').attr('src', iconUrl);
        locationTextToInput();
	}
}

function updateUserLocation (data) {
	 $('#userLocation').off("keydown").on('keydown', (keyPressed) => {
			 if(keyPressed.which == 13) { //check if enter is pressed if so update location..

				userLocationInput = $('#userLocation').val()
				if(userLocationInput.length != 0) {
				//Should check if location is valid if so do this, if not give user error.
				// Set item to local storage
				//console.log('Nu ska inputen vara giltlig');
				settings.data.q = userLocationInput;
				localStorage.setItem('Location', settings.data.q)


				loadAPIRequest();
				$('#userLocation').replaceWith(`<a href="#" id="updateLocation">${settings.data.q}</a>`);
				locationTextToInput ();
					// check if there is an existing user name
					// and display it in <h2>
				}
				else {
					console.log('oppss nu ska inputen vara ogiltlig');
				}
				}

	});
}

function locationTextToInput () {
	// Change userLocation text to input field if user clicks on it.
	$('#updateLocation').off("click").on('click', () => {
		$('#updateLocation').replaceWith(`<input type="text" placeholder="Enter your location" id="userLocation">`);
		$('#userLocation').select();
		updateUserLocation();
	});
}
