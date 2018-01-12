angular.module('bidgely')
  .controller('LoginCtrl', ['$scope', '$rootScope', 'BidgelyStorage', '$http', '$state', function ($scope, $rootScope, BidgelyStorage, $http, $state) {
        $scope.user = {
            name: "",
            password: ""
        };
        $scope.loginError = null;
        $scope.btnDisabled = false;
        $scope.$on('$viewContentLoaded', function () {

            BidgelyStorage.getItem('utilityPilot').then(function (value) {
                $scope.utilityPilot = value;
            });
        });

        $scope.login = function () {
          if (!$scope.user.name || !$scope.user.password) {
            $scope.loginError = "Please enter username and password.";
            return;
          }
          $scope.loginError = null;
          if (!$scope.utilityPilot) {
              $state.go('utilityPilot');
          }
          $scope.btnDisabled = true;
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
                    $scope.loginError = "You are not an admin user of Bidgely.";
                    $scope.btnDisabled = false;
                    //return;
                }
                BidgelyStorage.setItem('isLoggedIn', true).then(function () {
                  $state.go('dashboard.search');
                });
          }).error(function (response) {
              $scope.btnDisabled = false;
              try {
                response = JSON.parse(response.error.message);
                if (response) {
                  $scope.loginError = response.error.message;
                }
              } catch(e) {}

          });
        };

  }]);
