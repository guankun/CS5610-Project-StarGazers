(function() {
    angular
        .module("StarGazers")
        .controller("StarListController", StarListController)
        .controller("NewStarController", NewStarController)
        .controller("EditStarController", EditStarController)
        .controller("CreateStarController", CreateStarController)
        .controller("StarAllListController", StarAllListController)
        .filter('trusted', ['$sce', function ($sce) {
            return $sce.trustAsResourceUrl;
        }]);

    function StarListController($routeParams, $timeout, StarService){
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.stars = [];
        vm.error = null;
        StarService.findStarsByUserId(vm.uid).then(
            function successCallback(res){
                vm.stars = res.data;
            },
            function errorCallback(res){
                vm.stars = [];
                vm.error = res.data;
            }
        );

        vm.setStyle = function (star) {
            return {
                "font-size": star.size + 'px',
                "width": star.width + 'px'
            }
        };

        vm.setHTML = function (star){
            return star.text;
        };

        vm.sortItems = function (start, end) {

            //console.log("start: " + start + " end: " + end);
            var item = vm.stars[start];

            var del_index = start < end ? start:start+1;
            vm.stars.splice(end, 0, item);
            vm.stars.splice(del_index, 1);
        };
    }

    function StarAllListController($window, StarService){
        var vm = this;
        vm.stars = [];
        vm.uid = -1;
        var user = JSON.parse($window.localStorage.getItem("currentSGUser"));
        if(user != null){
            vm.uid = user._id;
        }
        StarService.findAllStars().then(
            function successCallback(res){
                vm.stars = res.data;
            },
            function errorCallback(res){
                vm.stars = [];
                vm.error = res.data;
            }
        );

        vm.setStyle = function (star) {
            return {
                "font-size": star.size + 'px',
                "width": star.width + 'px'
            }
        };

        vm.setHTML = function (star){
            return star.text;
        };

        vm.sortItems = function (start, end) {

            //console.log("start: " + start + " end: " + end);
            var item = vm.stars[start];

            var del_index = start < end ? start:start+1;
            vm.stars.splice(end, 0, item);
            vm.stars.splice(del_index, 1);
        }
    }

    function NewStarController($routeParams){
        var vm = this;
        vm.sid = $routeParams.sid;
        vm.uid = $routeParams.uid;
    }

    function CreateStarController($routeParams, $timeout, $location, StarService, NgMap) {
        var vm = this;
        vm.sid = $routeParams.sid;
        vm.uid = $routeParams.uid;
        vm.starType = $routeParams.stype;

        NgMap.getMap().then(function(map) {
            vm.map = map;
        });
        vm.placeMarker = function(e) {
            if(vm.marker != null){
                vm.marker.setMap(null);
            }
            vm.marker = new google.maps.Marker({position: e.latLng, map: vm.map});
            vm.coordinates = e.latLng.toJSON();
            vm.coordinatesStr = e.latLng.toString();
            vm.map.panTo(e.latLng);
        };

        vm.newStar = newStar;
        vm.uploadFile = uploadFile;
        function newStar(){
            if(!vm.name){
                vm.error = "Name cannot be empty!";
                return;
            }
            var s = {
                _user: vm.uid,
                type: vm.starType,
                name: vm.name,
                text: vm.text,
                placeholder: vm.placeholder,
                description: vm.description,
                url: vm.url,
                width: vm.width,
                height: vm.height,
                rows: vm.rows,
                size: vm.size,
                coordinates: vm.coordinates
            };
            StarService.createStar(vm.uid, s).then(
                function successCallback(res){
                    $location.url("/user/" + vm.uid + "/star");
                    vm.created = "Star created!";
                },
                function errorCallback(res){
                    vm.error = res.data;
                }
            );

            $timeout(function () {
                vm.created = null;
            }, 3000);
        }

        function uploadFile(myFile){
            var file = myFile;
            var uploadUrl = "/api/upload";
            var fd = new FormData();
            fd.append('file', file);

            StarService.upload(file, vm.uid, -1).then(
                function successCallback(res){
                    vm.uploading = null;
                    vm.uploaded = "Upload Success!";
                    vm.url = res;
                },
                function errorCallback(res){
                    vm.uploading = null;
                    vm.error = res;
                },
                function progressCallback(progress){
                    vm.uploading = "Image uploading....." + Math.floor(progress) + '%';
                }
            );
        }
    }

    function EditStarController($routeParams, $location, $timeout, StarService, NgMap) {
        var vm = this;
        vm.uid = $routeParams.uid;
        vm.sid = $routeParams.sid;



        StarService.findStarById($routeParams.sid).then(
            function successCallback(res){
                vm.star = res.data;
                vm.name = vm.star.name;
                vm.starType = vm.star.type;
                vm.size = vm.star.size ? vm.star.size : 10;
                vm.width = vm.star.width;
                vm.text = vm.star.text;
                vm.url = vm.star.url;
                vm.placeholder = vm.star.placeholder;
                vm.rows = vm.star.rows;
                vm.coordinates = vm.star.coordinates;
                if(vm.star.type == "LOCATION"){
                    NgMap.getMap().then(function(map) {
                        vm.map = map;
                        vm.coordinatesStr = "(" + vm.coordinates.lat + "," + vm.coordinates.lng + ")";
                        vm.marker = new google.maps.Marker({position: vm.star.coordinates, map: vm.map});
                        vm.map.panTo(vm.coordinates);
                    });
                }
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );
        StarService.findStarsByUserId(vm.uid).then(
            function successCallback(res){
                vm.stars = res.data;
            },
            function errorCallback(res){
                vm.error = res.data;
            }
        );

        vm.updateStar = updateStar;
        vm.deleteStar = deleteStar;
        vm.uploadFile = uploadFile;
        vm.placeMarker = placeMarker;

        function placeMarker(e) {
            if(vm.marker != null){
                vm.marker.setMap(null);
            }
            console.log(e.latLng.toJSON());
            vm.marker = new google.maps.Marker({position: e.latLng, map: vm.map});
            vm.coordinates = e.latLng.toJSON();
            vm.coordinatesStr = e.latLng.toString();
            vm.map.panTo(e.latLng);
        }

        function updateStar() {
            if(!vm.name){
                vm.error = "Name cannot be empty!";
                return;
            }
            var updatedStar = vm.star;
            updatedStar.name = vm.name;
            updatedStar.text = vm.text;
            updatedStar.size = vm.size;
            updatedStar.url = vm.url;
            updatedStar.width = vm.width;
            updatedStar.rows = vm.rows;
            updatedStar.placeholder = vm.placeholder;
            updatedStar.coordinates = vm.coordinates;

            StarService.updateStar($routeParams.sid, updatedStar).then(
                function successCallback(res){
                    $location.url("/user/" + vm.uid + "/star");
                    vm.updated = "Star updated!";
                },
                function errorCallback(res){
                    vm.error = res.data;
                }
            );

            $timeout(function () {
                vm.updated = null;
            }, 3000);
        }

        function deleteStar() {
            StarService.deleteStar($routeParams.sid).then(
                function successCallback(res){
                    vm.deleted = "Star deleted!";
                    $location.url("/user/" + vm.uid + "/star");
                },
                function errorCallback(res){
                    vm.error = res.data;
                }
            );

            $timeout(function () {
                vm.deleted = null;
            }, 3000);
        }

        function uploadFile(myFile){
            if(myFile == null || myFile == undefined){
                vm.error = "No File is Selected !!";
                return;
            }
            var file = myFile;
            var uploadUrl = "/api/upload";
            var fd = new FormData();
            fd.append('file', file);

            StarService.upload(file, vm.uid, vm.sid).then(
                function successCallback(res){
                    vm.uploading = null;
                    vm.star.url = res;
                    vm.url = res;
                    vm.uploaded = "Upload Success!";
                },
                function errorCallback(res){
                    vm.uploading = null;
                    vm.error = res;
                },
                function progressCallback(progress){
                    vm.uploaded = null;
                    vm.uploading = "Image uploading....." + Math.floor(progress) + '%';
                }
            );
        }
    }


})();