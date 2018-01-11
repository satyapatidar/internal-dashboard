angular.module('bidgely')
    .controller('PaaswordResetCtrl', function ($scope, $rootScope, parameters, $uibModalInstance) {

        console.log(parameters);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
