angular.module('bidgely')
    .controller('PaaswordResetCtrl', function ($scope, $rootScope, parameters, $uibModalInstance, $http) {
        var uuids = parameters;
        var _utilityPilot = null;
        // last is "" so -2
        var _lastIndex = parameters.length - 2;
        var _currentIndex = 0;

        $scope.actionList = [];
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        var initialize = function () {

        };

        BidgelyStorage.getItem('utilityPilot').then(function (value) {
            _utilityPilot = value;
        });

        $scope.resetPaasword = function () {
            if (_utilityPilot) {
                reseting(_currentIndex + 1);
            }
        };

        var reseting = function (currInd) {
            $http({
                url: "https://" + _utilityPilot.url + "/meta/users/" + uuids[currInd],
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + _utilityPilot.token
                }
            }).success(function (data, status, headers, config) {
                if(data && data.email) {
                    $scope.actionList.push({msg: "Sending password reset email to: " + data.email});
                    $http({
                        url: "https://" + _utilityPilot.url + "/v2.0/users/resetpassword",
                        method: "PUT",
                        data: JSON.stringify({email: data.email}),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + _utilityPilot.token
                        }
                    }).success(function (data, status, headers, config) {
                        if (currInd == _lastIndex) {
                            $scope.actionList.push({msg: "Sent reset password emails to all users."});
                            $scope.disableBtn = false;
                            return;
                        } else {
                            $scope.actionList.push({msg: "Sent password reset email to: " + data.email});
                            reseting((currInd + 1));
                        }
                    }).error(function (erorr) {
                        $scope.actionList.push({msg: "Reset password failed for: " + data.email});
                        if (currInd == _lastIndex) {
                            $scope.actionList.push({msg: "Sent reset password emails to all users."});
                            $scope.disableBtn = false;
                            return;
                        } else {
                            reseting((currInd + 1));
                        }
                    });
                } else {
                    if (currInd == _lastIndex) {
                        $scope.actionList.push({msg: "Sent reset password emails to all users."});
                        $scope.disableBtn = false;
                        return;
                    } else {
                        reseting((currInd + 1));
                    }
                }
            }).error(function (erorr) {
              $scope.actionList.push({msg: "Reset password failed for: " + uuids[currInd]});
              if (currInd == _lastIndex) {
                  $scope.actionList.push({msg: "Sent reset password emails to all users."});
                  $scope.disableBtn = false;
                  return;
              } else {
                  reseting((currInd + 1));
              }
            });
        };

        initialize();
    });
