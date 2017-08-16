(function(){
    angular
        .module("StarGazers")
        .factory('StarService', StarService);

    function StarService($http, $q){

        var services = {
            "createStar" : createStar,
            "findStarsByUserId" : findStarsByUserId,
            "findStarById" : findStarById,
            "updateStar" : updateStar,
            "deleteStar" : deleteStar,
            "upload": upload,
            "findAllStars": findAllStars
        };

        return services;


        function createStar(userId, star) {
            var url = "/api/user/" + userId + "/star";
            return $http.post(url, star);
        }

        function findStarsByUserId(userId) {
            var url = "/api/user/" + userId + "/star";
            return $http.get(url);
        }

        function findAllStars(){
            return $http.get("/api/star");
        }

        function findStarById(starId) {
            var url = "/api/star/" + starId;
            return $http.get(url);
        }

        function updateStar(starId, star) {
            var url = "/api/star/" + starId;
            return $http.put(url, star);
        }

        function deleteStar(starId) {
            var url = "/api/star/" + starId;
            return $http.delete(url);
        }

        function upload(file, userId, starId){
            var url = "/api/upload";
            var fd = new FormData();
            fd.append('file', file);
            fd.append('userId', userId);
            fd.append("starId", starId);

            var defer = $q.defer();
            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined},
                uploadEventHandlers: { progress: function(e) {
                    defer.notify(e.loaded * 100 / e.total);
                }}
            }).success(defer.resolve.bind(defer)).error(defer.reject.bind(defer));
            return defer.promise;
        }

    }
})();