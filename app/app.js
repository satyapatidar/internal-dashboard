var bidgelyApp = angular.module('bidgely', ['ui.router', 'LocalForageModule'])
    .run(function ($rootScope, $state, $stateParams, $q, BidgelyStorage) {

      $rootScope.headerTemplate = 'app/header/header.html';
      $rootScope.footerTemplate = 'app/footer/footer.html';

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams, stateOptions) {
            if (fromState.name.indexOf('utilityPilot') < 0) {
              BidgelyStorage.getItem('isLoggedIn').then(function (value) {
                  if (value !== true) {
                      $state.go('utilityPilot');
                  }
              });
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            $rootScope.headerTemplate = 'app/header/header.html';
            $rootScope.footerTemplate = 'app/footer/footer.html';
        });

        var onLoad = function() {

        };

        onLoad();
    });
