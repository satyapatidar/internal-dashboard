angular.module('bidgely')
    .controller('UnsubscribeUsersCtrl', function ($scope, $rootScope, parameters, $uibModalInstance, $http, BidgelyStorage) {
        var uuids = parameters;
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

        var EVENTS = {
          "MONTHLY_SUMMARY": "Monthly Energy Report - your consumption itemized per appliance",
          "NEIGHBOURHOOD_COMPARISON": "Comparison to similar home - learns how much you spent compared to similar homes",
          "USAGE_ALERT": "High Usage Alert - get notified when you used a lot of electricity",
          "BILL_PROJECTION": "Projection of your bill - avoid being surprised by a high bill",
          "AO_SAVINGS": "Update on your Savings Opportunity - see how much you can save"
        };

        var initialize = function () {
            var events = configurations.emailEvents;
            $scope.emailEvents = [];
            for (var i = 0; i < events.length; i++) {
                var obj = {
                  text: EVENTS[events[i]],
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
                postData(0);
            }
        };

        var postData = function (currInd) {
            var uuid = uuids[currInd];
            if (!uuid) {
              $scope.actionList.push({msg: "Done unsubscribing Email events for all the users."});
              $scope.disableBtn = false;
              return;
            }
            $http({
                url: "https://" + _utilityPilot.url + "/v2.1/notifications/users/" + uuid + "/preferences/Email/unsubscribe",
                method: 'POST',
                data: JSON.stringify(_unsubscribeEvents),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + _utilityPilot.token
                }
            }).success(function (data) {
                $scope.actionList.push({msg: "Done"});
                postData((currInd + 1));
            }).error(function (response, status) {
                var message = (status == 500) ? "Something went wrong on the server." : response.error.message;
                $scope.actionList.push({msg: "Failed: " + message});
                postData((currInd + 1));
            });
        }
        initialize();
    });
