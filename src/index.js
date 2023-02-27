const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const resultIcon = document.getElementById("result-icon");
const resultCityName = document.getElementById("result-city-name");
const resultTemperature = document.getElementById("result-temperature");
const resultHumidity = document.getElementById("result-humidity");
const resultWindSpeed = document.getElementById("result-wind-speed");
const resultSunrise = document.getElementById("result-sunrise");
const resultSunset = document.getElementById("result-sunset");
const API_KEY = "51a76e1c056bf58efd0266169939564e";

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
      resultIcon.setAttribute("src", `../assets/images/icons/Clear-Day.svg`);
    } else if (new Date().getHours() > 18 && new Date().getHours() < 6 && JSON.parse(xhr.responseText).weather[0].main === "Clear") {
      resultIcon.setAttribute("src", `../assets/images/icons/Clear-Night.svg`);
    } else {
      resultIcon.setAttribute("src", `../assets/images/icons/${JSON.parse(xhr.responseText).weather[0].main}.svg`);
    }

    resultCityName.innerHTML = `City: ${JSON.parse(xhr.responseText).name}`;

    resultTemperature.innerHTML = `<span style="font-weight: bold">Temperature:</span> ${Math.round(JSON.parse(xhr.responseText).main.temp)} &#8451`;

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
        resultIcon.setAttribute("src", `../assets/images/icons/Clear-Day.svg`);
      } else if (new Date().getHours() > 18 && new Date().getHours() < 6 && JSON.parse(xhr.responseText).weather[0].main === "Clear") {
        resultIcon.setAttribute("src", `../assets/images/icons/Clear-Night.svg`);
      } else {
        resultIcon.setAttribute("src", `../assets/images/icons/${JSON.parse(xhr.responseText).weather[0].main}.svg`);
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
