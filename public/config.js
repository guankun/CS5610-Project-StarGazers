(function(){
    angular
        .module("StarGazers")
        .config(configuration);

    function configuration($routeProvider) {
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
            var deferred = $q.defer();
            $http.get('/api/loggedin').success(function(user) {
                $rootScope.errorMessage = null;
                if (user !== '0') {
                    deferred.resolve(user);
                } else {
                    deferred.reject();
                    alert("You are not logged in or unauthorised!");
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
            .otherwise({
                redirectTo : "/"
            });
    }
})();