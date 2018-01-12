angular.module('bidgely')
    .controller('SearchCtrl', function ($scope, $rootScope, $http, $q, $state) {
        $scope.search = {
          query: null
        }
        $scope.displaySearchResults = [];
        $scope.isSearching = false;

        $scope.$on('$viewContentLoaded', function () {

            BidgelyStorage.getItem('utilityPilot').then(function (value) {
                $scope.utilityPilot = value;
            });
        });

        $scope.searchData = function () {
            getSearchResult().then(function (searchResults) {
                populateSearchList(searchResults);
            });
        };

        var getSearchResult = function () {
            $scope.isSearching = true;
            var deferred = $q.defer();
            var url = "https://" + $scope.utilityPilot.url + "/v2.0/users/search";
            if ($scope.search.query) {
                url += "?text=" + encodeURIComponent($scope.search.query);
            }
            $http({
              url: url,
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'bearer ' + $scope.utilityPilot.token
              }
            }).success(function (data) {
                $scope.isSearching = false;
                deferred.resolve(data.payload);
            }).error(function (err) {
                $scope.isSearching = false;
                deferred.reslove(error);
            })
            return deferred.promise;
        };

        var populateSearchList = function (searchResults) {
            $scope.displaySearchResults = searchResults.data;
        };

        $scope.viewDetail = function (uuid) {
            if (!uuid) {
                return;
            }
            $state.go('dashboard.viewDetail', {uuid: uuid});
        };
    });
