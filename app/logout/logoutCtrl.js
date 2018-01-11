angular.module('bidgely')
  .controller('LogoutCtrl', function ($scope, $rootScope, BidgelyStorage, $q, $state) {

        $scope.$on('$viewContentLoaded', function () {
            var promises = {
              removeUtiliyPilot: BidgelyStorage.removeItem('utilityPilot'),
              removeIsLoggedIn : BidgelyStorage.removeItem('isLoggedIn')
            }

            $q.all(promises).then(function () {
                $state.go('utilityPilot');
            });
        });
  });
