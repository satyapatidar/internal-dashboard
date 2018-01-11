angular.module('bidgely')
  .controller('LoginCtrl', ['$scope', '$rootScope', 'BidgelyStorage', '$http', '$state', function ($scope, $rootScope, BidgelyStorage, $http, $state) {
        $scope.user = {
            name: "",
            password: ""
        };
        $scope.showAuthFailMsg = false;

        $scope.$on('$viewContentLoaded', function () {

            BidgelyStorage.getItem('utilityPilot').then(function (value) {
                $scope.utilityPilot = value;
            });
        });

        $scope.login = function () {
          if (!$scope.user.name || !$scope.user.password) {
            return;
          }
          if (!$scope.utilityPilot) {
              $state.go('utilityPilot');
          }
          $http({
              url: "https://" + $scope.utilityPilot.url + "/v2.0/users/authenticate" ,
              method: 'POST',
              data: JSON.stringify({userName: $scope.user.name, password: $scope.user.password}),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'bearer ' + $scope.utilityPilot.token
              }
          }).success(function (data) {
                if (data.payload.user.roleId !== 'ROLE_ADMIN') {
                    $scope.showAuthFailMsg = true;
                }
                BidgelyStorage.setItem('isLoggedIn', true).then(function () {
                  $rootScope.authToken = data.payload.accessToken;
                  $state.go('dashboard.search');
                });
          }).error(function (err) {
              console.log("Err");
              console.log(err);
          });
        };

  }]);
