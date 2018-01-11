angular.module('bidgely')
    .controller('UnsubscribeUsersCtrl', function ($scope, $rootScope, parameters, $uibModalInstance, $http, BidgelyStorage) {
        var uuids = parameters;
        // last is "" so -2
        var _lastIndex = parameters.length - 2;
        var _currentIndex = 0;
        var _unsubscribeEvents = [];
        var _utilityPilot = null;

        $scope.actionList = [];
        $scope.disableBtn = false;

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        BidgelyStorage.getItem('utilityPilot').then(function (value) {
            _utilityPilot = value;
        });

        var mockData = {
          "MONTHLY_SUMMARY": "Monthly Energy Report - your consumption itemized per appliance",
          "NEIGHBOURHOOD_COMPARISON": "Comparison to similar home - learns how much you spent compared to similar homes",
          "USAGE_ALERT": "High Usage Alert - get notified when you used a lot of electricity",
          "BILL_PROJECTION": "Projection of your bill - avoid being surprised by a high bill",
          "AO_SAVINGS": "Update on your Savings Opportunity - see how much you can save"
        }

        var initialize = function () {
            var events = configurations.emailEvents;
            $scope.emailEvents = [];
            for (var i = 0; i < events.length; i++) {
                var obj = {
                  text: mockData[events[i]],
                  id: events[i],
                  value:false
                }
                $scope.emailEvents.push(obj);
            }
        };

        $scope.unsubscribe = function () {
            for (var i = 0; i < $scope.emailEvents.length; i++) {
                if ($scope.emailEvents[i].value) {
                      _unsubscribeEvents.push($scope.emailEvents[i].id);
                }
            }
            if (_unsubscribeEvents.length > 0 && _utilityPilot) {
                $scope.disableBtn = true;
                postData(_currentIndex + 1);
            }
        };

        var postData = function (currInd) {
            $http({
                url: "https://" + _utilityPilot.url + "/v2.1/notifications/users/" + uuids[currInd] + "/preferences/Email/unsubscribe" ,
                method: 'POST',
                data: JSON.stringify(_unsubscribeEvents),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + _utilityPilot.token
                }
            }).success(function (data) {
                $scope.actionList.push({msg: "Unsubscribe for this user " + uuids[currInd]});
                if (currInd == _lastIndex) {
                    $scope.actionList.push({msg: "Completed unsubscribe action"});
                    $scope.disableBtn = false;
                    return;
                } else {
                    postData((currInd + 1));
                }
            }).error(function (err) {
                $scope.actionList.push({msg: "Failed for this user " + uuids[currInd]});
                console.log("Err");
                console.log(err);
            });
        }
        initialize();
    });
