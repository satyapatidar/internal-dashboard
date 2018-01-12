angular.module('bidgely')
    .controller('TriggerDissagCtrl', function ($scope, $q, parameters, $uibModalInstance, $http) {

      var uuids = parameters;
      var _utilityPilot = null;
      $scope.disableBtn = false;
      $scope.actionList = [];

      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

      BidgelyStorage.getItem('utilityPilot').then(function (value) {
          _utilityPilot = value;
      });

      $scope.runAggAndTriggerDisagg = function () {
          if (_utilityPilot) {
              postCall(0);
          }
      };

      var postCall = function (currInd) {
          $scope.disableBtn = true;
          var uuid = uuids[currInd];
          if (!uuid) {
            $scope.actionList.push({msg: "Done Aggregations run and triggering disagg for all the users."});
            $scope.disableBtn = false;
            return;
          }

          var promises = {
            triggerDisagg: triggerDisagg(uuid),
            runAggregation: runAggregation(uuid)
          };

          $q.all(promises).then(function () {
              $scope.actionList.push({msg: "Done"});
              postCall((currInd + 1));
          }, function (response, status) {
              var message = '';
              if (status == 500) {
                 message = "Something went wrong on the server.";
              }
              if (response.error) {
                 message = response.error.message;
              }
              $scope.actionList.push({msg: "Failed: " + message});
              postCall((currInd + 1));
          });
      };

      var triggerDisagg = function (uuid) {
          var deferred = $q.defer();
          $http({
              url: "https://" + _utilityPilot.url + "/meta/users/" + uuid + "/homes/1/modified?urgent=true",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'bearer ' + _utilityPilot.token
              }
          }).success(function (data, status, headers, config) {
              deferred.resolve();
          }).error(function (response, status) {
              deferred.reject(response, status);
          });
          return deferred.promise;
      };

      var runAggregation = function (uuid) {
          var deferred = $q.defer();
          $http({
              url: "https://" + _utilityPilot.url + "/billingdata/users/" + uuid + "/homes/1/run/aggregations",
              method: "POST",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'bearer ' + _utilityPilot.token
              }
          }).success(function (data, status, headers, config) {
              deferred.resolve();
          }).error(function (response, status) {
              deferred.reject(response, status);
          });
          return deferred.promise;
      };
    });
