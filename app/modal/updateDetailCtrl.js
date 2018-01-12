angular.module('bidgely')
  .controller('UpdateDetailCtrl', function ($scope, $state, $uibModalInstance, $http, parameters, $stateParams, $timeout) {
      var _utilityPilot = null;

      var initialise = function () {
          $scope.detail = {
            fname: parameters.firstName,
            lname: parameters.lastName,
            email: parameters.email,
            newPassword: ''
          };
          $scope.disableBtn = false;
          $scope.message = null;

          BidgelyStorage.getItem('utilityPilot').then(function (value) {
              _utilityPilot = value;
          })
      };

      $scope.cancel = function() {
          $uibModalInstance.close();
      };

      $scope.update = function () {
          $scope.message = null;
          var postData = {};

          if (($scope.detail.fname && $scope.detail.fname !== parameters.firstName)) {
              postData['firstName'] = $scope.detail.fname;
          }
          if (($scope.detail.lname && $scope.detail.lname !== parameters.lastName)) {
              postData['lastName'] = $scope.detail.lname;
          }
          if (($scope.detail.email && $scope.detail.email !== parameters.email)) {
              postData['email'] = $scope.detail.email;
          }
          if ($scope.detail.newPassword) {
              postData['password'] = $scope.detail.newPassword;
          }

          for (var key in postData) {
              if (postData.hasOwnProperty(key)) {

              } else {
                $scope.message = "No Updates";
                return;
              }
          }

          $scope.disableBtn = true;
          $http({
            url: "https://" + _utilityPilot.url + "/v2.0/users/" + $stateParams.uuid,
            method: 'POST',
            data: JSON.stringify(postData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + _utilityPilot.token
            }
          }).success(function (data) {
              $scope.message = "Details Updated Successfully";
              $scope.disableBtn = false;
          }).error(function (err) {
              $scope.message = "Failed to Update details.";
              $scope.disableBtn = false;
          });
      };

      initialise();
  });
