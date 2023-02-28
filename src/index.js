const theme = document.getElementById("theme");
const header = document.getElementById("header");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const result = document.getElementById("result");
const resultIcon = document.getElementById("result-icon");
const resultCityName = document.getElementById("result-city-name");
const resultTemperature = document.getElementById("result-temperature");
const resultHumidity = document.getElementById("result-humidity");
const resultWindSpeed = document.getElementById("result-wind-speed");
const resultSunrise = document.getElementById("result-sunrise");
const resultSunset = document.getElementById("result-sunset");

const API_KEY = "51a76e1c056bf58efd0266169939564e";

const themeBaseClass = theme.className;
const headerBaseClass = header.className;
const searchBtnBaseClass = searchBtn.className;
const resultBaseClass = result.className;

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

searchBtn.addEventListener("click", () => {
	const xhr = new XMLHttpRequest();

	xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value.trim()}&appid=${API_KEY}&units=metric`);

	xhr.onload = function () {
		resultIcon.style.opacity = "1";

		if (new Date().getHours() >= 6 && new Date().getHours() <= 18 && JSON.parse(xhr.responseText).weather[0].main === "Clear") {
			resultIcon.setAttribute("src", `./assets/images/icons/Clear-Day.svg`);
		} else if ((new Date().getHours() > 18 || new Date().getHours() < 6) && JSON.parse(xhr.responseText).weather[0].main === "Clear") {
			resultIcon.setAttribute("src", `./assets/images/icons/Clear-Night.svg`);
		} else {
			resultIcon.setAttribute("src", `./assets/images/icons/${JSON.parse(xhr.responseText).weather[0].main}.svg`);
		}

		resultCityName.innerHTML = `<span style="font-weight: bold">City: ${JSON.parse(xhr.responseText).name}</span>`;

		resultTemperature.innerHTML = `<span style="font-weight: bold">Temperature:</span> ${Math.round(JSON.parse(xhr.responseText).main.temp)} &#8451`;

		resultHumidity.innerHTML = `<span style="font-weight: bold">Humidity:</span> ${Math.round(JSON.parse(xhr.responseText).main.humidity)} %`;

		resultWindSpeed.innerHTML = `<span style="font-weight: bold">Wind speed:</span> ${Math.round(
			JSON.parse(xhr.responseText).wind.speed,
		)} meter/second`;

		resultSunrise.innerHTML = `<span style="font-weight: bold">Sunrise at:</span> ${new Date(
			JSON.parse(xhr.responseText).sys.sunrise * 1000,
		).toLocaleString()}`;

		resultSunset.innerHTML = `<span style="font-weight: bold">Sunset at:</span> ${new Date(
			JSON.parse(xhr.responseText).sys.sunset * 1000,
		).toLocaleString()}`;

		searchInput.value = "";
	};

	xhr.send();
});

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

			if (new Date().getHours() >= 6 && new Date().getHours() <= 18 && JSON.parse(xhr.responseText).weather[0].main === "Clear") {
				resultIcon.setAttribute("src", `./assets/images/icons/Clear-Day.svg`);
			} else if (new Date().getHours() > 18 && new Date().getHours() < 6 && JSON.parse(xhr.responseText).weather[0].main === "Clear") {
				resultIcon.setAttribute("src", `./assets/images/icons/Clear-Night.svg`);
			} else {
				resultIcon.setAttribute("src", `./assets/images/icons/${JSON.parse(xhr.responseText).weather[0].main}.svg`);
			}

			resultCityName.innerHTML = `City: ${JSON.parse(xhr.responseText).name}`;

			resultTemperature.innerHTML = `<span style="font-weight: bold">Temperature:</span> ${Math.round(
				JSON.parse(xhr.responseText).main.temp,
			)} &#8451`;

			resultHumidity.innerHTML = `<span style="font-weight: bold">Humidity:</span> ${Math.round(JSON.parse(xhr.responseText).main.humidity)} %`;

			resultWindSpeed.innerHTML = `<span style="font-weight: bold">Wind speed:</span> ${Math.round(
				JSON.parse(xhr.responseText).wind.speed,
			)} meter/second`;

			resultSunrise.innerHTML = `<span style="font-weight: bold">Sunrise at:</span> ${new Date(
				JSON.parse(xhr.responseText).sys.sunrise * 1000,
			).toString()}`;

			resultSunset.innerHTML = `<span style="font-weight: bold">Sunset at:</span> ${new Date(
				JSON.parse(xhr.responseText).sys.sunset * 1000,
			).toString()}`;

			searchInput.value = "";
		};

		xhr.send();

		map.panTo({ lat: e.latLng.lat(), lng: e.latLng.lng() });

		markerHandler(e);
	});

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
			strokeColor: "green",
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: "lightgreen",
			fillOpacity: 0.2,
		});
		circle.setMap(map);
	}
};

// This function takes a number as the number of the month(index 0 to 11) and chooses a proper theme color
function themeChanger(num) {
	if (num < 3) {
		document.body.style.backgroundImage = "url(./assets/images/background/winter.jpg)";
		theme.className = themeBaseClass + " bg-blue-600";
		header.className = headerBaseClass + " bg-blue-400";
		searchBtn.className = searchBtnBaseClass + " bg-blue-600" + " hover:bg-blue-700";
		result.className = resultBaseClass + " bg-blue-400";
	} else if (num >= 3 && num < 6) {
		document.body.style.backgroundImage = "url(./assets/images/background/spring.jpg)";
		theme.className = themeBaseClass + " bg-pink-600";
		header.className = headerBaseClass + " bg-pink-400";
		searchBtn.className = searchBtnBaseClass + " bg-pink-600" + " hover:bg-pink-700";
		result.className = resultBaseClass + " bg-pink-400";
	} else if (num >= 6 && num < 9) {
		document.body.style.backgroundImage = "url(./assets/images/background/summer.jpg)";
		theme.className = themeBaseClass + " bg-green-600";
		header.className = headerBaseClass + " bg-green-400";
		searchBtn.className = searchBtnBaseClass + " bg-green-600" + " hover:bg-green-700";
		result.className = resultBaseClass + " bg-green-400";
	} else if (num >= 9) {
		document.body.style.backgroundImage = "url(./assets/images/background/autumn.jpg)";
		theme.className = themeBaseClass + " bg-orange-600";
		header.className = headerBaseClass + " bg-orange-400";
		searchBtn.className = searchBtnBaseClass + " bg-orange-600" + " hover:bg-orange-700";
		result.className = resultBaseClass + " bg-orange-400";
	}
}

// Choose a default city name and start the search
searchInput.value = "Tehran";
searchBtn.click();
