(function() {
    angular
        .module("StarGazers")
        .controller("HomeController", HomeController);

    function HomeController($routeParams, $timeout, $window){
        var vm = this;
        vm.user = JSON.parse($window.localStorage.getItem("currentSGUser"));
        if(vm.user == null){
            vm.welcomeOrReg = "Sign in";
            vm.loginOrLogout = "Login";
            vm.profileOrRegHref = "register";
            vm.loginOrLogoutHref = "login";
        }
        else{
            vm.welcomeOrReg = "Welcome, " + vm.user.username;
            vm.loginOrLogout = "Logout";
            vm.profileOrRegHref = "profile";
            vm.loginOrLogoutHref = "logout";
        }
    }
})();