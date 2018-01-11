angular.module('bidgely')
    .controller('TriggerDissagCtrl', function ($scope, $rootScope, parameters, $uibModalInstance, $http) {

      var uuids = parameters;
      var _utilityPilot = null;

      $scope.actionList = [];
      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

      BidgelyStorage.getItem('utilityPilot').then(function (value) {
          _utilityPilot = value;
      });

      $scope.triggerDisagg = function () {
          if (_utilityPilot) {
              postCall(0);
          }
      };

      var postCall = function (currInd) {
          var uuid = uuids[currInd];
          if (!uuid) {
            $scope.actionList.push({msg: "Done triggering disagg for all the users."});
            $scope.disableBtn = false;
            return;
          }

          $http({
              url: "https://" + _utilityPilot.url + "/meta/users/" + uuid + "/homes/1/modified?urgent=true",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'bearer ' + _utilityPilot.token
              }
          }).success(function (data, status, headers, config) {
              $scope.actionList.push({msg: "Done"});
              postCall((currInd + 1));
          }).error(function (response, status) {
              var message = (status == 500) ? "Something went wrong on the server." : response.error.message;
              $scope.actionList.push({msg: "Failed: " + message});
              postCall((currInd + 1));
          });
      };

    });
