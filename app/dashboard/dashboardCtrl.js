angular.module('bidgely')
    .controller('DashboardCtrl', function ($scope, $rootScope, $state) {

        $scope.sideMenuClicked = function ($event, type) {
            $event.preventDefault();
            if (!type) {
                return;
            }
            switch (type) {
              case 'fileUpload':
                $state.go('dashboard.bulkUpdate');
                break;
              case 'search':
                $state.go('dashboard.search');
                break;
              case 'changePilot':
                $state.go('logout');
            }
        }
    });
