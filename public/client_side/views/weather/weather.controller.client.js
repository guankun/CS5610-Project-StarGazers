(function() {
    angular
        .module("StarGazers")
        .controller("WeatherController", WeatherController);

    function WeatherController(WeatherService, NgMap){
        var vm = this;

        NgMap.getMap().then(
            function(map) {
                vm.map = map;
            },
            function(res){
                vm.error = res.data;
            });

        vm.currentWeather = {}
        vm.placeMarker = placeMarker;

        vm.info = "Click on the map to select a loction.";
        function placeMarker(e) {
            if(vm.marker != null){
                vm.marker.setMap(null);
            }
            vm.marker = new google.maps.Marker({position: e.latLng, map: vm.map});
            vm.coordinates = e.latLng.toJSON();
            vm.lat = e.latLng.toJSON().lat;
            vm.lng = e.latLng.toJSON().lng;
            vm.info = "Current weather at (" + vm.lat +"," + vm.lng + ")";
            vm.map.panTo(e.latLng);

            WeatherService.getCurrentWeather(vm.lat, vm.lng).then(
                function successCallback(res){
                    var rawData = res.data;
                    vm.currentWeather.location = rawData.name;
                    vm.currentWeather.main = rawData.weather[0].main;
                    vm.currentWeather.temperature = rawData.main.temp;
                    vm.currentWeather.humidity = rawData.main.humidity;
                    vm.currentWeather.windSpeed = rawData.wind.speed;
                    vm.currentWeather.clouds = rawData.clouds.all;
                    vm.currentWeather.rain = rawData.rain["3h"];
                    vm.currentWeather.sunrise = rawData.sys.sunrise;
                    vm.currentWeather.sunset = rawData.sys.sunset;
                },
                function errorCallback(res){
                    vm.error = res;
                },
                function progressCallback(progress){
                    vm.loading = "Fetching Weather....." + Math.floor(progress) + '%';
                }
            );
        }
    }
})();