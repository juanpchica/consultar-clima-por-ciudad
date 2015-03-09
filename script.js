

(function (){


	/*------------------------------------------
		Declaracion de variables y objetos
	------------------------------------------*/

	var today = new Date();
    var timeNow = today.toLocaleTimeString();

    var addCity = document.getElementById("js-search");
    var loadCities = document.getElementById("js-load");
    var deleteCities = document.getElementById("js-delete");
	var nameCity = $("[data-input='cityAdd']");

	var API_WORLDTIME_KEY = "d6a4075ceb419113c64885d9086d5";
    var API_WORLDTIME = "https://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=" + API_WORLDTIME_KEY + "&q=";
    console.log(cities);
    var cities = [];
    console.log(cities);
	var cityWeather = {};
	cityWeather.zone;
	cityWeather.icon;
	cityWeather.tem;
	cityWeather.tem_max;
	cityWeather.tem_min;
	cityWeather.main;
	cityWeather.humidity;
	cityWeather.pressure;



	/*------------------------------------------
		$Eventos
	------------------------------------------*/

	addCity.addEventListener("click",addNewCity);

	loadCities.addEventListener("click",loadWeatherCities);

	deleteCities.addEventListener("click",deleteWeatherCities);
   
    $( nameCity ).on("keypress", function(event) {
	    if(event.which == 13) {
	      addNewCity(event);
	    }
	});





	/*------------------------------------------
		$Obtener mi ubicacion		
	------------------------------------------*/

	if(navigator.geolocation){

		navigator.geolocation.getCurrentPosition(getCoords,error);

	}else{
		alert("Por favor actualize su navegador");
	}




	/*------------------------------------------
		$Funciones de ejecucion
	------------------------------------------*/

	function loadWeatherCities(event){
		
		event.preventDefault();

	    function renderCities(cities) {
	      cities.forEach(function(city) {
	        renderTemplate(city);
	      });
	    };

	    var cities = JSON.parse( localStorage.getItem("cities") );
	    renderCities(cities);
	}

	function deleteWeatherCities(e){
		event.preventDefault();

		localStorage.removeItem("cities");
		location.reload();
	}


	function addNewCity(e){
		e.preventDefault();
		
		$.getJSON('http://api.openweathermap.org/data/2.5/weather?q='+$(nameCity).val(), getWeatherNewCity);

	}


	function getWeatherNewCity(data){
		 

		$.getJSON(API_WORLDTIME + $(nameCity).val(), function(response){
			
			$(nameCity).val("");

			cityWeather = {};
			cityWeather.zone = data.name;
			cityWeather.icon = "http://openweathermap.org/img/w/"+data.weather[0].icon+".png";
			cityWeather.tem = data.main.temp - 273.15;
			cityWeather.tem_min = data.main.temp_min - 273.15;
			cityWeather.tem_max = data.main.temp_max - 273.15;
			cityWeather.main = data.weather[0].main;
			cityWeather.humidity = data.main.humidity;
			cityWeather.pressure = data.main.pressure;

			renderTemplate(cityWeather, response.data.time_zone[0].localtime);

			/*Guardo las ciudades en el array*/
			cities.push(cityWeather);

    		/*Guardo el string en el localstorage*/
    		localStorage.setItem("cities", JSON.stringify(cities));

		});

	}

	function getCoords(position){
		lat = position.coords.latitude;
		lon = position.coords.longitude;

		$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+"&lon="+lon,getCurrentWeather);
		
	}

	function getCurrentWeather(data){
		
		$(".loader").hide();
		
		cityWeather.zone = data.name;
		cityWeather.icon = "http://openweathermap.org/img/w/"+data.weather[0].icon+".png";
		cityWeather.tem = data.main.temp - 273.15;
		cityWeather.tem_min = data.main.temp_min - 273.15;
		cityWeather.tem_max = data.main.temp_max - 273.15;
		cityWeather.main = data.weather[0].main;
		cityWeather.humidity = data.main.humidity;
		cityWeather.pressure = data.main.pressure;
		renderTemplate(cityWeather);
	}

	function error(error){
		alert("Un error ocurrio: "+error.code);
	}

	function activateTemplate(id){
		var t = document.querySelector(id);
		return document.importNode(t.content,true);
	}

	function renderTemplate(cityWeather, localtime){
		var clone = activateTemplate("#js-template");

		var timeToShow;

	    if (localtime) {
	      timeToShow = localtime.split(" ")[1];
	    } else {
	      timeToShow = timeNow;
	    }

		clone.querySelector("[data-zone]").innerHTML = cityWeather.zone;
		clone.querySelector("[data-tem]").innerHTML = cityWeather.tem.toFixed(1);
		clone.querySelector("[data-tem-min]").innerHTML = cityWeather.tem_min.toFixed(1);
		clone.querySelector("[data-tem-max]").innerHTML = cityWeather.tem_max.toFixed(1);
		clone.querySelector("[data-main]").innerHTML = cityWeather.main;
		clone.querySelector("[data-picture]").src = cityWeather.icon;
		clone.querySelector("[data-humidity]").innerHTML = cityWeather.humidity.toFixed(1);
		clone.querySelector("[data-pressure]").innerHTML = cityWeather.pressure.toFixed(1);
		clone.querySelector("[data-hour]").innerHTML = timeToShow;

		/* Le decimos que pegue al dom el template nuevo y actualizado*/

		$(".weather").append(clone);
	}

})()