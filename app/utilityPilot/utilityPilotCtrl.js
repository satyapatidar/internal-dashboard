angular.module('bidgely')
    .controller('UtilityPilotCtrl', function ($scope, $rootScope, BidgelyStorage, $state, $stateParams) {
        $scope.utilityPilots = configurations.utilityPilots;

        $scope.selectedPilot = {
          name: null
        };

        $scope.$on('$viewContentLoaded', function () {
            BidgelyStorage.getItem('isLoggedIn').then(function (value) {
                if (value == true) {
                    $scope.saveUtilityPilot();
                    $state.go('dashboard.search');
                }
            });
        });

        $scope.saveUtilityPilot = function () {
            for (var i = 0; i < $scope.utilityPilots.length; i++) {
                if ($scope.utilityPilots[i].name == $scope.selectedPilot.name) {
                    $rootScope.utilityPilot = $scope.utilityPilots[i];
                    BidgelyStorage.setItem('utilityPilot', $scope.utilityPilots[i]);
                    $state.go('login');
                }
            }
        };

    });
