angular.module('bidgely')
    .controller('TriggerDissagCtrl', function ($scope, $rootScope, parameters, $uibModalInstance) {

        console.log(parameters);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
