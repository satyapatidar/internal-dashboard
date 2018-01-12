angular.module('bidgely')
    .controller('DeactivateUsersCtrl', function ($scope, $q, parameters, $uibModalInstance, $http) {
        var uuids = parameters;
        var _utilityPilot = null;

        $scope.actionList = [];
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        BidgelyStorage.getItem('utilityPilot').then(function (value) {
            _utilityPilot = value;
        });

        $scope.deactivate = function () {
            if (_utilityPilot) {
                postCalls(0);
            }
        };

        var postCalls = function (currInd) {
            var uuid = uuids[currInd];
            if (!uuid) {
              $scope.actionList.push({msg: "Done deactivating all the users."});
              $scope.disableBtn = false;
              return;
            }
            $http({
                url: "https://" + _utilityPilot.url + "/meta/users/" + uuid + "/homes/1/gws",
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
                    postCalls((currInd + 1));
                    return;
                }
                var promises = {
                      decommissionUser: decommissionUserCall(decommissionGateway),
                      userData: updateUserData(uuids[currInd])
                };

                $q.all(promises).then(function () {
                    postCalls((currInd + 1));
                }, function (response, status) {
                    var message = "Something went wrong on the server.";
                    $scope.actionList.push({msg: "Failed: " + message});
                    postCalls((currInd + 1));
                });

            }).error(function (response, status, headers, config) {
                var message = (status == 500) ? "Something went wrong on the server." : response.error.message;
                $scope.actionList.push({msg: "Failed: " + message});
                postCalls((currInd + 1));
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

        var getUserData = function (uuid) {
            var deferred = $q.defer();
            $http({
                url: "https://" + _utilityPilot.url + "/v2.0/users/" + uuid,
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

        var updateUserData = function (uuid) {
            var deferred = $q.defer();
            getUserData(uuid).then(function(data) {
              var uname = "DEACTIVATED-" + data.userName;
              var email = "DEACTIVATED-" + data.email;
              var fname = "DEACTIVATED-" + data.firstName;
              var lname = "DEACTIVATED-" + data.lastName;
              $http({
                  url: "https://" + _utilityPilot.url + "/v2.0/users/" + uuid,
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
