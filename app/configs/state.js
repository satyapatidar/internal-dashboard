bidgelyApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // $locationProvider.html5Mode(true);

      $stateProvider
      .state('login', {
          url: '/login',
          templateUrl: 'app/login/login.html',
          controller: 'LoginCtrl'
      })
      .state('logout', {
          url: '/logout',
          templateUrl: 'app/logout/logout.html',
          controller: 'LogoutCtrl'
      })
      .state('utilityPilot', {
          url: '/utilityPilot',
          templateUrl: 'app/utilityPilot/utilityPilot.html',
          controller: 'UtilityPilotCtrl'
      })
      .state('dashboard', {
          abstract: true,
          templateUrl: 'app/dashboard/dashboard.html',
          controller: 'DashboardCtrl'
      })
      .state('dashboard.search', {
          url: '/dashboard/search',
          templateUrl: 'app/dashboard/search/search.html',
          controller: "SearchCtrl"
      })
      .state('dashboard.viewDetail', {
          url: '/dashboard/viewDetail/:uuid',
          templateUrl: 'app/dashboard/userDetail/userDetail.html',
          controller: "UserDetailCtrl"
      })
      .state('dashboard.bulkUpdate', {
          url: '/dashboard/bulkUpdate',
          templateUrl: 'app/dashboard/fileUpload/fileUpload.html',
          controller: "FileUploadCtrl"
      })

    $urlRouterProvider.otherwise(function($injector, $location) {
        if(window.location.pathname == "/") {
            return 'utilityPilot';
        }
    });
});
