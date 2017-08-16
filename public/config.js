(function(){
    angular
        .module("StarGazers")
        .config(configuration);

    function configuration($routeProvider) {
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope, $window) {
            var deferred = $q.defer();
            $http.get('/api/loggedin').success(function(user) {
                $rootScope.errorMessage = null;
                if (user !== '0') {
                    deferred.resolve(user);
                } else {
                    deferred.reject();
                    $window.localStorage.setItem("currentSGUser", null);
                    alert("You are not logged in or unauthorised, or session time out!");
                    $location.url('/');
                }
            });
            return deferred.promise;
        };

        $routeProvider
            .when('/', {
                 templateUrl : "client_side/views/home/home.view.client.html",
                 controller: "HomeController",
                 controllerAs: "model"
             })
            .when('/register', {
                templateUrl : "client_side/views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when('/login', {
                templateUrl : "client_side/views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when ("/profile", {
                templateUrl: "client_side/views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/logout', {
                templateUrl : "client_side/views/home/home.view.client.html",
                controller: "LogoutController",
                controllerAs: "model"
            })
            .when('/star', {
                templateUrl : "client_side/views/star/star-all-list.view.client.html",
                controller: "StarAllListController",
                controllerAs: "model"
            })
            .when('/user/:uid/star', {
                templateUrl : "client_side/views/star/star-list.view.client.html",
                controller: "StarListController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/star/new', {
                templateUrl : "client_side/views/star/star-chooser.view.client.html",
                controller: "NewStarController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/star/:sid', {
                templateUrl : "client_side/views/star/star-edit.view.client.html",
                controller: "EditStarController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/user/:uid/star/create/:stype', {
                templateUrl : "client_side/views/star/star-new.view.client.html",
                controller: "CreateStarController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when('/weather', {
                templateUrl : "client_side/views/weather/weather.view.client.html",
                controller: "WeatherController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo : "/"
            });
    }
})();