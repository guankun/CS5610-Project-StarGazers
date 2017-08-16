(function() {
    angular
        .module("StarGazers")
        .factory('WeatherService', WeatherService);

    function WeatherService($http){

        var services = {
            "getCurrentWeather": getCurrentWeather
        };

        return services;

        function getCurrentWeather(lat, lng){
            return $http.get("/api/weather/current/" + lat + "/" + lng);
        }
    }

})();