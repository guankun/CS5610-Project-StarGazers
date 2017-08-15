(function() {
    angular
        .module("StarGazers")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController)
        .controller("LogoutController", LogoutController);

    function LoginController($location, $rootScope, $window, UserService) {
        var vm = this;
        vm.error = null;
        vm.user = {};
        vm.login = login;
        function login(user) {
            if(!user.username || !user.password){
                vm.error = "Username and password cannot be empty!";
                return;
            }
            UserService
                .login(user)
                .then(
                    function (res) {
                        var user = res.data;
                        $window.localStorage.setItem("currentSGUser", angular.toJson(user));
                        $location.url("/profile");
                    },
                    function (res) {
                        vm.error = "Wrong username or password.";
                    }
                );
        }
    }

    function RegisterController($location, $rootScope, $window, UserService) {
        var vm = this;
        vm.user = {};
        vm.error = null;
        vm.register = register;

        function register(user){
            var username = user.username;
            var password = user.password;
            var vpassword = user.vpassword;
            if (username === undefined || username === null || username === "" || password === undefined || password === "") {
                vm.error = "Username and Passwords cannot be empty.";
                return;
            }
            if (password !== vpassword) {
                vm.error = "Password does not match.";
                return;
            }
            var newUser = {
                username: username,
                password: password
            }
            UserService.register(newUser).then(
                function(res) {
                    var userCreated = res.data;
                    $window.localStorage.setItem("currentSGUser", angular.toJson(userCreated));
                    $location.url("/profile");
                },
                function error(res) {
                    vm.error = "User Register failed. " + res.data;
        }
            );
        }
    }

    function ProfileController($routeParams, $location, $timeout, $rootScope, $window, UserService) {
        var vm = this;
        vm.updated = null;
        vm.logout = logout;
        vm.error = null;
        vm.user = JSON.parse($window.localStorage.getItem("currentSGUser"));
        UserService.findUserById(vm.user._id).then(
            function successCallback(res){
                vm.user = res.data;
                vm.uid = $routeParams.uid;
                vm.updateUser = updateUser;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );

        function logout() {
            UserService
                .logout()
                .then(
                    function(res) {
                        $window.localStorage.setItem("currentSGUser", null);
                        $location.url("/");
                    },
                    function (response) {
                        vm.error = res.data;
                    }
                );
        }

        function updateUser() {
            var update_user = vm.user;
            update_user.username = vm.user.username;
            update_user.email = vm.user.email;
            update_user.firstName = vm.user.firstName;
            update_user.lastName = vm.user.lastName;
            UserService.updateUser(update_user._id, update_user).then(
                function successCallback(res){
                    vm.updated = "Profile changes saved!";
                },
                function errorCallback(res){
                    vm.error = res.data;
                }
            );

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }
    }

    function LogoutController($location, $window, UserService){
        UserService
            .logout()
            .then(
                function(res) {
                    $window.localStorage.setItem("currentSGUser", null);
                    console.log('logout');
                    $location.url("/");
                },
                function (response) {
                    vm.error = res.data;
                }
            );
    }
})();