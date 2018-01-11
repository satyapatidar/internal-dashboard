angular.module('bidgely')
    .controller('DeactivateUsersCtrl', function ($scope, $rootScope, parameters, $uibModalInstance) {

        console.log(parameters);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
