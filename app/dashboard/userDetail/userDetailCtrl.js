angular.module('bidgely')
    .controller('UserDetailCtrl', function ($scope, $rootScope, $http, $q, $state, $stateParams, $uibModal) {
        var _utilityPilot = null;

        $scope.actionList = [];
        $scope.disableBtns = false;

        $scope.$on('$viewContentLoaded', function () {
            BidgelyStorage.getItem('utilityPilot').then(function (value) {
                _utilityPilot = value;

                if (!$stateParams.uuid) {
                    $state.go('dashboard.search');
                }
                initialise();
            });
        });


        var initialise = function () {
            $http({
                url: "https://" + _utilityPilot.url + "/v2.0/users/" + $stateParams.uuid,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + _utilityPilot.token
                }
            }).success(function (data, status, headers, config) {
                $scope.userDetail =  data.payload;
            }).error(function (data, status, headers, config) {

            })
        };

        $scope.updateUser = function () {
            $scope.actionList = [];
            var modalInstance = $uibModal.open({
                templateUrl: 'app/modal/updateDetail.html',
                controller: 'UpdateDetailCtrl',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    parameters: function () {
                        return $scope.userDetail;
                    }
                }
            });
            modalInstance.result.then(function () {
                $state.reload($state.current.name, $stateParams);
            });
        };

        $scope.unsubscribe = function () {
            $scope.actionList = [];
            var modalInstance = $uibModal.open({
                templateUrl: 'app/modal/unsubscribe.html',
                controller: 'UnsubscribeCtrl',
                backdrop: 'static',
                size: 'md'
            });
            modalInstance.result.then(function () {
                $state.reload($state.current.name, $stateParams);
            });
        };

        $scope.triggerDisagg = function () {
            $scope.actionList = [];
            var modalInstance = $uibModal.open({
                templateUrl: 'app/modal/triggerDisaggForSingleUser.html',
                controller: 'TriggerDissagForSingleUserCtrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    parameters: function () {
                        return $scope.userDetail;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.disableBtns = true;
                $http({
                    url: "https://" + _utilityPilot.url + "/meta/users/" + $scope.userDetail.uuid + "/homes/1/modified?urgent=true",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + _utilityPilot.token
                    }
                }).success(function (data, status, headers, config) {
                    $scope.disableBtns = false;
                    $scope.actionList.push({msg: "Successfully trigger disagg."});
                }).error(function (response, status) {
                    $scope.disableBtns = false;
                    var message = (status == 500) ? "Something went wrong on the server." : response.error.message;
                    $scope.actionList.push({msg: "Failed: " + message});
                });
            });
        };

        $scope.deactivate = function () {
            $scope.actionList = [];

            var modalInstance = $uibModal.open({
                templateUrl: 'app/modal/deactivateSingleUser.html',
                controller: 'DeactivateSingleUserCtrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    parameters: function () {
                        return $scope.userDetail;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.disableBtns = true;
                $http({
                    url: "https://" + _utilityPilot.url + "/meta/users/" + $scope.userDetail.uuid + "/homes/1/gws",
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + _utilityPilot.token
                    }
                }).success(function (data, status, headers, config) {
                    var gatewayData = data;
                    var decommissionGateway = null;
                    for (var key in gatewayData) {
                      if (gatewayData.hasOwnProperty(key) && gatewayData[key]['decommissioned'] == 'false' && gatewayData[key]['type'] == "0") {
                          decommissionGateway = key;
                          break;
                      }
                    }
                    if (!decommissionGateway) {
                        $scope.actionList.push({msg: "No decommisioned=false gateway found"});
                        $scope.disableBtns = false;
                        return;
                    }
                    var promises = {
                        decommissionUser: decommissionUserCall(decommissionGateway),
                        userData: updateUserData()
                    };

                    $q.all(promises).then(function () {
                        $scope.actionList.push({msg: "Done deactivating."});
                        $scope.disableBtns = false;
                    }, function (response, status) {
                        var message = "Something went wrong on the server.";
                        $scope.actionList.push({msg: "Failed: " + message});
                        $scope.disableBtns = false;
                    });

                }).error(function (response, status, headers, config) {
                    var message = (status == 500) ? "Something went wrong on the server." : response.error.message;
                    $scope.actionList.push({msg: "Failed: " + message});
                    $scope.disableBtns = false;
                });
            });
        };

        var decommissionUserCall = function (decommissionGateway) {
            var deferred = $q.defer();
            $http({
                url: "https://" + _utilityPilot.url + "/meta" + decommissionGateway + "/decommission",
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + _utilityPilot.token
                }
            }).success(function (data, status, headers, config) {
                deferred.resolve();
            }).error(function (data, status, headers, config) {
                deferred.reject();
            })
            return deferred.promise;
        };

        var getUserData = function () {
            var deferred = $q.defer();
            $http({
                url: "https://" + _utilityPilot.url + "/v2.0/users/" + $scope.userDetail.uuid,
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + _utilityPilot.token
                }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data.payload);
            }).error(function (data, status, headers, config) {
                deferred.reject();
            })
            return deferred.promise;
        };

        var updateUserData = function () {
            var deferred = $q.defer();
            getUserData($scope.userDetail.uuid).then(function(data) {
              var uname = "DEACTIVATED-" + data.userName;
              var email = "DEACTIVATED-" + data.email;
              var fname = "DEACTIVATED-" + data.firstName;
              var lname = "DEACTIVATED-" + data.lastName;
              $http({
                  url: "https://" + _utilityPilot.url + "/v2.0/users/" + $scope.userDetail.uuid,
                  method: "POST",
                  data: JSON.stringify({userName: uname, email: email, firstName: fname, lastName: lname}),
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': 'bearer ' + _utilityPilot.token
                  }
              }).success(function (data, status, headers, config) {
                  console.log(data);
                  deferred.resolve();
              }).error(function (data, status, headers, config) {
                  deferred.reject();
              })
            }, function() {
              deferred.reject();
            });

            return deferred.promise;
        };
    });
