angular.module('bidgely')
  .controller('FileUploadCtrl', function ($scope, $rootScope, BidgelyStorage, $state, $stateParams, $uibModal) {

      $scope.noFileData = true;
      $scope.fileContent = null;
      $scope.totalUsers = null;
      $scope.$on('$viewContentLoaded', function () {
          BidgelyStorage.getItem('utilityPilot').then(function (value) {
              if (!value) {
                  $state.go('utilityPilot');
              }
              $scope.utilityPilot = value;
          });
      });

      $scope.fileUpload = function () {
          if ($scope.fileContent) {
              $scope.noFileData = false;
              processData();
          }
      };

      var processData = function() {
          var fileContent = $scope.fileContent;
          // split content based on new line
          var allTextLines = fileContent.split(/\r\n|\n/);
          var headers = allTextLines[0].split(',');
          var lines = [];

          for ( var i = 0; i < allTextLines.length; i++) {
              // split content based on comma
              var data = allTextLines[i].split(',');
              if (data.length == headers.length) {
                  var tarr = [];
                  for ( var j = 0; j < headers.length; j++) {
                      tarr.push(data[j]);
                  }
                  lines.push(tarr);
              }
          }
          $scope.data = lines;
          $scope.totalUsers = lines.length - 1;
      };

      $scope.unsubscribeUsers = function () {
          $uibModal.open({
              templateUrl: 'app/modal/unsubscribeUsers.html',
              controller: 'UnsubscribeUsersCtrl',
              backdrop: 'static',
              size: 'md',
              resolve: {
                  parameters: function () {
                      return $scope.data;
                  }
              }
          });
      };

      $scope.deactivateUsers = function () {
          $uibModal.open({
              templateUrl: 'app/modal/deactivateUsers.html',
              controller: 'DeactivateUsersCtrl',
              backdrop: 'static',
              size: 'md',
              resolve: {
                  parameters: function () {
                      return $scope.data;
                  }
              }
          });
      };

      $scope.triggerDissag = function () {
          $uibModal.open({
              templateUrl: 'app/modal/triggerDissag.html',
              controller: 'TriggerDissagCtrl',
              backdrop: 'static',
              size: 'md',
              resolve: {
                  parameters: function () {
                      return $scope.data;
                  }
              }
          });
      };

      $scope.passwordReset = function () {
        $uibModal.open({
            templateUrl: 'app/modal/passwordReset.html',
            controller: 'PaaswordResetCtrl',
            backdrop: 'static',
            size: 'md',
            resolve: {
                parameters: function () {
                    return $scope.data;
                }
            }
        });
      };

  });
