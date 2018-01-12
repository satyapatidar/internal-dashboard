angular.module('bidgely')
    .controller('DeactivateSingleUserCtrl', function ($scope, $uibModalInstance, $http, parameters) {

      $scope.user = parameters;

      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

      $scope.deactivate = function () {
          $uibModalInstance.close();
      };
    });
