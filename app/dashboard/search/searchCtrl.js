angular.module('bidgely')
    .controller('SearchCtrl', function ($scope, $rootScope, $http, $q) {
        $scope.search = {
          query: null
        }

        $scope.$on('$viewContentLoaded', function () {

            BidgelyStorage.getItem('utilityPilot').then(function (value) {
                $scope.utilityPilot = value;
            });
        });

        $scope.searchData = function () {
            if (!$scope.search.query) {
                return;
            }
            getSearchResult().then(function (searchResults) {
                populateSearchList(searchResults);
            });
        };

        var getSearchResult = function () {
            var deferred = $q.defer();
            $http({
              url: "https://" + $scope.utilityPilot.url + "/v2.0/users/search?text=" + encodeURIComponent($scope.search.query) + "&showMeterId=false&offset=100&limit=100",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'bearer' + $scope.utilityPilot.token
              }
            }).success(function (data) {
                deferred.resolve(data.payload);
            }).error(function (err) {
                deferred.reslove(error);
            })
            return deferred.promise;
        };

        var populateSearchList = function (searchResults) {

        };
    });
