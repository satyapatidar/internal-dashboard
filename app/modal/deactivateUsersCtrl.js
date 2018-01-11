angular.module('bidgely')
    .controller('DeactivateUsersCtrl', function ($scope, $q, parameters, $uibModalInstance, $http) {
        var uuids = parameters;
        var _utilityPilot = null;
        // last is "" so -2
        var _lastIndex = parameters.length - 2;
        var _currentIndex = 0;

        $scope.actionList = [];
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


        BidgelyStorage.getItem('utilityPilot').then(function (value) {
            _utilityPilot = value;
        });

        $scope.deactivate = function () {
            if (_utilityPilot) {
                postCalls(_currentIndex + 1)
            }
        };

        var postCalls = function (currInd) {
            $http({
                url: "https://" + _utilityPilot.url + "/meta/users/" + uuids[currInd] + "/homes/1/gws",
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
                    if (currInd == _lastIndex) {
                        $scope.actionList.push({msg: "Completed deactivate action"});
                        $scope.disableBtn = false;
                        return;
                    } else {
                        postCalls((currInd + 1));
                        return;
                    }
                }
                var promises = {
                      decommissionUser: decommissionUserCall(decommissionGateway),
                      homeData: updateHomeData(uuids[currInd])
                };

                $q.all(promises).then(function () {
                    $scope.actionList.push({msg: "deactivate for" + uuids[currInd]});
                    if (currInd == _lastIndex) {
                        $scope.actionList.push({msg: "Completed deactivate action"});
                        $scope.disableBtn = false;
                        return;
                    } else {
                        postCalls((currInd + 1));
                    }
                }, function (error) {
                    $scope.actionList.push({msg: "failed to deactivate for" + uuids[currInd]});
                    if (currInd == _lastIndex) {
                        $scope.actionList.push({msg: "Completed deactivate action"});
                        $scope.disableBtn = false;
                        return;
                    } else {
                        postCalls((currInd + 1));
                    }
                });

            }).error(function (data, status, headers, config) {
                $scope.actionList.push({msg: "failed to deactivate for" + uuids[currInd]});
                if (currInd == _lastIndex) {
                    $scope.actionList.push({msg: "Completed deactivate action"});
                    $scope.disableBtn = false;
                    return;
                } else {
                    postCalls((currInd + 1));
                }
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

        var updateHomeData = function (uuid) {
            var deferred = $q.defer();
            $http({
                url: "https://" + _utilityPilot.url + "/meta/users/" + uuid,
                method: "POST",
                data: JSON.stringify({uname: "deactivate", email: "deactivate",fname: "deactivate", lname: "deactivate"}),
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
            return deferred.promise;
        };
    });
