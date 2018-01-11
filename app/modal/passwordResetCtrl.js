angular.module('bidgely')
    .controller('PaaswordResetCtrl', function ($scope, $rootScope, parameters, $uibModalInstance, $http) {
        var uuids = parameters;
        var _utilityPilot = null;

        $scope.actionList = [];
        $scope.user = {
          newPassword: ""
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        BidgelyStorage.getItem('utilityPilot').then(function (value) {
            _utilityPilot = value;
        });

        $scope.resetPaasword = function () {
            if (!$scope.user.newPassword) {
              return;
            }

            if (_utilityPilot) {
                $scope.disableBtn = true;
                resetting(0);
            }
        };

        var resetting = function (currInd) {
          var uuid = uuids[currInd];
          if (!uuid) {
            $scope.actionList.push({msg: "Done resetting password for all the users."});
            $scope.disableBtn = false;
            return;
          }
          $scope.actionList.push({msg: "Resetting password for user: " + uuid});
          $http({
              url: "https://" + _utilityPilot.url + "/v2.0/users/" + uuid,
              method: "POST",
              data: JSON.stringify({password: $scope.user.newPassword}),
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'bearer ' + _utilityPilot.token
              }
          }).success(function (data, status, headers, config) {
              $scope.actionList.push({msg: "Done"});
              resetting((currInd + 1));
          }).error(function (response) {
              var message = response.error.message;
              $scope.actionList.push({msg: "Failed: " + message});
              resetting((currInd + 1));
          });
        };

    });
