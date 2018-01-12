angular.module('bidgely')
    .controller('TriggerDissagForSingleUserCtrl', function ($scope, $uibModalInstance, $http, parameters) {

      $scope.user = parameters;

      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

      $scope.runAggAndTriggerDisagg = function () {
          $uibModalInstance.close();
      };
    });
