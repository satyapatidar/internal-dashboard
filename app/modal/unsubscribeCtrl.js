angular.module('bidgely')
    .controller('UnsubscribeCtrl', function ($scope, $rootScope, $stateParams, $uibModalInstance, $http, BidgelyStorage) {
        var _utilityPilot = null, _unsubscribeEvents = [];
        $scope.message = null;

        var _emailEvents = {
          "MONTHLY_SUMMARY": "Monthly Energy Report - your consumption itemized per appliance",
          "NEIGHBOURHOOD_COMPARISON": "Comparison to similar home - learns how much you spent compared to similar homes",
          "USAGE_ALERT": "High Usage Alert - get notified when you used a lot of electricity",
          "BILL_PROJECTION": "Projection of your bill - avoid being surprised by a high bill",
          "AO_SAVINGS": "Update on your Savings Opportunity - see how much you can save"
        }


        $scope.cancel = function() {
            $uibModalInstance.close();
        };

        var initialize = function () {
            var events = configurations.emailEvents;
            $scope.emailEvents = [];

            BidgelyStorage.getItem('utilityPilot').then(function (value) {
                _utilityPilot = value
            })
            for (var i = 0; i < events.length; i++) {
                var obj = {
                  text: _emailEvents[events[i]],
                  id: events[i],
                  value:false
                }
                $scope.emailEvents.push(obj);
            }
        };

        $scope.unsubscribe = function () {
            $scope.message = null;

            for (var i = 0; i < $scope.emailEvents.length; i++) {
                if ($scope.emailEvents[i].value) {
                    _unsubscribeEvents.push($scope.emailEvents[i].id);
                }
            }
            if (_unsubscribeEvents.length > 0 && _utilityPilot) {
                $scope.disableBtn = true;
                $http({
                    url: "https://" + _utilityPilot.url + "/v2.1/notifications/users/" + $stateParams.uuid + "/preferences/Email/unsubscribe" ,
                    method: 'POST',
                    data: JSON.stringify(_unsubscribeEvents),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + _utilityPilot.token
                    }
                }).success(function (data) {
                    $scope.disableBtn = false;
                    $scope.message = "Unsubscribe Successfully.";
                }).error(function (err) {
                    $scope.disableBtn = false;
                    $scope.message = "Unsubscribe action Failed.";
                });
            }
        };

        initialize();
    });
