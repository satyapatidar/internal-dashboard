angular.module('bidgely')
    .controller('TriggerDissagForSingleUserCtrl', function ($scope, $uibModalInstance, $http, parameters) {

      $scope.user = parameters;

      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

      $scope.triggerDisagg = function () {
          $uibModalInstance.close();
      };
    });
