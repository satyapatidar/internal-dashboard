angular.module('bidgely')
    .controller('TriggerDissagCtrl', function ($scope, $rootScope, parameters, $uibModalInstance, $http) {

      var uuids = parameters;
      var _utilityPilot = null;
      // last is "" so -2
      var _lastIndex = parameters.length - 2;
      var _currentIndex = 0;

      $scope.actionList = [];
      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

      BidgelyStorage.getItem('utilityPilot').then(function (value) {
          _utilityPilot = value;
      });

      $scope.triggerDisagg = function () {
          if (_utilityPilot) {
              postCall(_currentIndex + 1);
          }
      };

      var postCall = function (currInd) {
          $http({
              url: "https://" + _utilityPilot.url + "/meta/users/" + uuids[currInd] + "/homes/1/modified?urgent=true",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'bearer ' + _utilityPilot.token
              }
          }).success(function (data, status, headers, config) {
              $scope.actionList.push({msg: "triggering disagg for " + uuids[currInd]});
              if (currInd == _lastIndex) {
                  $scope.actionList.push({msg: "Completed trigger disagg action"});
                  $scope.disableBtn = false;
                  return;
              } else {
                  postCall((currInd + 1));
              }
          }).error(function (erorr) {
              $scope.actionList.push({msg: "failed for " + uuids[currInd]});
              if (currInd == _lastIndex) {
                  $scope.actionList.push({msg: "Completed disagg action"});
                  $scope.disableBtn = false;
                  return;
              } else {
                  postCall((currInd + 1));
              }
          });
      };

    });
