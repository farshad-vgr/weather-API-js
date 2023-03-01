const theme = document.getElementById("theme");
const header = document.getElementById("header");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mapBtn = document.getElementById("map-btn");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalBtn = document.getElementById("modal-btn");
const result = document.getElementById("result");
const resultIcon = document.getElementById("result-icon");
const resultCityName = document.getElementById("result-city-name");
const resultTemperature = document.getElementById("result-temperature");
const resultHumidity = document.getElementById("result-humidity");
const resultWindSpeed = document.getElementById("result-wind-speed");
const resultSunrise = document.getElementById("result-sunrise");
const resultSunset = document.getElementById("result-sunset");

const API_KEY = "51a76e1c056bf58efd0266169939564e";

// Store the base class of each element and then add theme classes to the end of the base class
const themeBaseClass = theme.className;
const headerBaseClass = header.className;
const searchInputBaseClass = searchInput.className;
const searchBtnBaseClass = searchBtn.className;
const mapBtnBaseClass = mapBtn.className;
const resultBaseClass = result.className;
const resultIconBeseClass = resultIcon.className;

themeChanger(new Date().getMonth()); // The current actual season(user local season) will be the default theme

const seasons = [0, 3, 6, 9]; // 4 numbers that each one is representing a season(index of first month of season)

// This button changes the theme with a random number
theme.addEventListener("click", () => {
	const randomNumber = Math.floor(Math.random() * (seasons.length - 1)); // New random number

	selectedNumber = seasons.splice(randomNumber, 1); // Picking a number from the first three indexes of the array

	themeChanger(selectedNumber[0]); // Using the selected number to change the theme

	seasons.push(selectedNumber[0]); // Store the used number at the last index of the array(to prevent repetitive selection)
});

// This function starts searching by clicking on the "Enter" key
searchInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		searchBtn.click();
	}
});

// Send and fetch the weather date when the search button clicked
searchBtn.addEventListener("click", () => {
	if (searchInput.value.trim() !== "") {
		searchInput.className = searchInputBaseClass;

		const xhr = new XMLHttpRequest();

		xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value.trim()}&appid=${API_KEY}&units=metric`);

		xhr.onload = function () {
			resultIcon.style.opacity = "1";

			const responseData = JSON.parse(xhr.responseText);

			if (responseData.cod === 200) {
				searchInput.className = searchInputBaseClass;

				resultIcon.setAttribute("src", `http://openweathermap.org/img/wn/${responseData.weather[0].icon}@2x.png`);

				resultCityName.innerHTML = `<span style="font-weight: bold">City:</span> ${responseData.name}<small class="ml-2">(Description: ${responseData.weather[0].description})</small>`;

				resultTemperature.innerHTML = `<span style="font-weight: bold">Temperature:</span> ${Math.round(responseData.main.temp)} &#8451`;

				resultHumidity.innerHTML = `<span style="font-weight: bold">Humidity:</span> ${Math.round(responseData.main.humidity)} %`;

				resultWindSpeed.innerHTML = `<span style="font-weight: bold">Wind speed:</span> ${Math.round(responseData.wind.speed)} meter/second`;

				resultSunrise.innerHTML = `<span style="font-weight: bold">Sunrise at:</span> ${new Date(responseData.sys.sunrise * 1000).toLocaleString()}`;

				resultSunset.innerHTML = `<span style="font-weight: bold">Sunset at:</span> ${new Date(responseData.sys.sunset * 1000).toLocaleString()}`;

				searchInput.value = "";
			} else {
				searchInput.className = searchInputBaseClass + " shadow-[inset_0_0_0.5rem_0.25rem_red]";
			}
		};

		xhr.send();
	} else {
		searchInput.className = searchInputBaseClass + " shadow-[inset_0_0_0.5rem_0.25rem_red]";
	}
});

mapBtn.addEventListener("click", () => {
	modalBackdrop.classList.replace("bottom-full", "bottom-0"); // Shows modal
});

modalBackdrop.addEventListener("click", (e) => {
	if (e.target === e.currentTarget) {
		modalBackdrop.classList.replace("bottom-0", "bottom-full"); // Hide modal if click on modal's background
	}
});

modalBtn.addEventListener("click", () => {
	modalBackdrop.classList.replace("bottom-0", "bottom-full"); // Hide modal
});

// Loading Google map at startup and fetching weather by clicking on the map
window.onload = function () {
	const mapOptions = {
		center: new google.maps.LatLng(35.71, 51.35),
		zoom: 10,
		panControl: true,
		zoomControl: true,
		mapTypeControl: true,
		mapTypeControl: true,
		scaleControl: true,
		streetViewControl: true,
		overviewMapControl: true,
		rotateControl: true,
		scrollwheel: true,
		disableDoubleClickZoom: true,
	};

	const map = new google.maps.Map(document.getElementById("google-map"), mapOptions);

	let marker, circle;

	google.maps.event.addListener(map, "click", function (e) {
		const xhr = new XMLHttpRequest();

		xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?lat=${e.latLng.lat()}&lon=${e.latLng.lng()}&appid=${API_KEY}&units=metric`);

		xhr.onload = function () {
			resultIcon.style.opacity = "1";

			const responseData = JSON.parse(xhr.responseText);

			resultIcon.setAttribute("src", `http://openweathermap.org/img/wn/${responseData.weather[0].icon}@2x.png`);

			resultCityName.innerHTML = `<span style="font-weight: bold">City:</span> ${responseData.name}<small class="ml-2">(Description: ${responseData.weather[0].description})</small>`;

			resultTemperature.innerHTML = `<span style="font-weight: bold">Temperature:</span> ${Math.round(responseData.main.temp)} &#8451`;

			resultHumidity.innerHTML = `<span style="font-weight: bold">Humidity:</span> ${Math.round(responseData.main.humidity)} %`;

			resultWindSpeed.innerHTML = `<span style="font-weight: bold">Wind speed:</span> ${Math.round(responseData.wind.speed)} meter/second`;

			resultSunrise.innerHTML = `<span style="font-weight: bold">Sunrise at:</span> ${new Date(responseData.sys.sunrise * 1000).toLocaleString()}`;

			resultSunset.innerHTML = `<span style="font-weight: bold">Sunset at:</span> ${new Date(responseData.sys.sunset * 1000).toLocaleString()}`;

			searchInput.value = "";
		};

		xhr.send();

		map.panTo({ lat: e.latLng.lat(), lng: e.latLng.lng() });

		markerHandler(e);
	});

	// This function handles the marker's position when clicking on the map
	function markerHandler(e) {
		if (typeof marker !== "undefined") {
			marker.setMap(null);
			circle.setMap(null);
		}

		marker = new google.maps.Marker({
			position: new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()),
			map: map,
			animation: google.maps.Animation.BOUNCE,
		});
		marker.setMap(map);

		circle = new google.maps.Circle({
			center: marker.getPosition(),
			radius: 3000,
			strokeColor: "red",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "red",
			fillOpacity: 0.2,
		});
		circle.setMap(map);
	}
};

// This function takes a number as the number of the month(index 0 to 11) and chooses a proper theme color
function themeChanger(num) {
	if (num < 3) {
		document.body.style.backgroundImage = "url(./assets/images/background/winter.jpg)";
		theme.className = themeBaseClass + " bg-blue-600" + " hover:bg-blue-700";
		header.className = headerBaseClass + " bg-blue-400";
		searchBtn.className = searchBtnBaseClass + " bg-blue-600" + " hover:bg-blue-700";
		mapBtn.className = mapBtnBaseClass + " bg-blue-600" + " hover:bg-blue-700";
		result.className = resultBaseClass + " bg-blue-400";
		resultIcon.className = resultIconBeseClass + " bg-blue-600";
	} else if (num >= 3 && num < 6) {
		document.body.style.backgroundImage = "url(./assets/images/background/spring.jpg)";
		theme.className = themeBaseClass + " bg-pink-600" + " hover:bg-pink-700";
		header.className = headerBaseClass + " bg-pink-400";
		searchBtn.className = searchBtnBaseClass + " bg-pink-600" + " hover:bg-pink-700";
		mapBtn.className = mapBtnBaseClass + " bg-pink-600" + " hover:bg-pink-700";
		result.className = resultBaseClass + " bg-pink-400";
		resultIcon.className = resultIconBeseClass + " bg-pink-600";
	} else if (num >= 6 && num < 9) {
		document.body.style.backgroundImage = "url(./assets/images/background/summer.jpg)";
		theme.className = themeBaseClass + " bg-green-600" + " hover:bg-green-700";
		header.className = headerBaseClass + " bg-green-400";
		searchBtn.className = searchBtnBaseClass + " bg-green-600" + " hover:bg-green-700";
		mapBtn.className = mapBtnBaseClass + " bg-green-600" + " hover:bg-green-700";
		result.className = resultBaseClass + " bg-green-400";
		resultIcon.className = resultIconBeseClass + " bg-green-600";
	} else if (num >= 9) {
		document.body.style.backgroundImage = "url(./assets/images/background/autumn.jpg)";
		theme.className = themeBaseClass + " bg-orange-600" + " hover:bg-orange-700";
		header.className = headerBaseClass + " bg-orange-400";
		searchBtn.className = searchBtnBaseClass + " bg-orange-600" + " hover:bg-orange-700";
		mapBtn.className = mapBtnBaseClass + " bg-orange-600" + " hover:bg-orange-700";
		result.className = resultBaseClass + " bg-orange-400";
		resultIcon.className = resultIconBeseClass + " bg-orange-600";
	}
}

// Choose a default city name and start the search
searchInput.value = "Tehran";
searchBtn.click();
