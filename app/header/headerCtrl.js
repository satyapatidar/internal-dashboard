angular.module('bidgely')
    .controller('HeaderCtrl', function ($scope, $state) {
          $scope.navbarCollapsed = true;
          $scope.showLoginLink = ($state.current.name != 'login');
          $scope.isUserLoggedIn = false;
          $scope.utilityPilot = {};
          var _hamBurgerClicked = false;

          $scope.navbarClicked = function navbarClicked(clickedOnHB) {
              _hamBurgerClicked = clickedOnHB;
              $scope.navbarCollapsed = !$scope.navbarCollapsed;
          };

          $scope.$on('$stateChangeSuccess', function(event, toState) {
              if(toState && toState.name && toState.name.indexOf('utilityPilot') > -1) {
                $scope.showNavbar = false;
              }
              else {
                $scope.showNavbar = true;
              }
              refreshHeader();
          });

          $scope.navigate = function(isOpenAsExternal) {
              var linkUrl = Navigation.dashboard.default.path;
              if($state.current && $state.current.name =='login') {
                linkUrl = '/login';
              }

              if(isOpenAsExternal) {
                window.open(linkUrl);
                return;
              }
              window.location.href = link;
          };

          $scope.menuClicked = function menuClicked(type) {
              $scope.navbarClicked();
              var params = null;
              if (_hamBurgerClicked) {
                  $scope.navbarClicked(false);
              }
              var stateName = null, linkUrl = null;
              switch(type) {
                  case "utilityPilot":
                    stateName = 'utilityPilot';

                    break;
                  case "logout":
                    $state.go(Navigation.logout.name);
                    break;
              }


              if(stateName) $state.go(stateName, params, {reload:true});
          };

          var refreshHeader = function refreshHeader() {
              BidgelyStorage.getItem('isLoggedIn').then(function (value) {
                  $scope.isUserLoggedIn = value;
                  if ($scope.isUserLoggedIn) {
                    BidgelyStorage.getItem('utilityPilot').then(function (pilot) {
                        $scope.utilityPilot = pilot;
                    });
                  }
              })
          };

          //JS is being lazy loaded now, so need to call refreshHeader automatically
          refreshHeader();
      })
  ;
