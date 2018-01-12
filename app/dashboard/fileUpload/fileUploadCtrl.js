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
          var lines = fileContent.split(/\r\n|\n/);
          var uuids = [];

          for ( var i = 0; i < lines.length; i++) {
            if(!lines[i]) {
              continue;
            }
            uuids.push(lines[i]);
          }
          $scope.uuids = uuids;
          $scope.totalUsers = uuids.length;
      };

      $scope.unsubscribeUsers = function () {
          $uibModal.open({
              templateUrl: 'app/modal/unsubscribeUsers.html',
              controller: 'UnsubscribeUsersCtrl',
              backdrop: 'static',
              size: 'md',
              resolve: {
                  parameters: function () {
                      return $scope.uuids;
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
                      return $scope.uuids;
                  }
              }
          });
      };

      $scope.runAggAndTriggerDisagg = function () {
          $uibModal.open({
              templateUrl: 'app/modal/triggerDissag.html',
              controller: 'TriggerDissagCtrl',
              backdrop: 'static',
              size: 'md',
              resolve: {
                  parameters: function () {
                      return $scope.uuids;
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
                    return $scope.uuids;
                }
            }
        });
      };

  });
