angular.module('bidgely')
    .factory('BidgelyStorage', function($q, $rootScope, $localForage) {

      var verifyItem = function(item, key) {
        var deferred = $q.defer();
        if(!item || item.expTime < new Date().getTime()) {
          BidgelyStorage.removeItem(key).then(function() {
            deferred.resolve({value:null, isNull:false});
          });
        }
        else {
          deferred.resolve({value:item.value, isNull:item.value === null});
        }
        return deferred.promise;
      };

      BidgelyStorage = {
          setItem:function(key, value, options) {
            var item = angular.element.extend(true, {exp:24*60*60, currTime:new Date().getTime()}, options);
            var date = new Date(item.currTime);
            item.expTime = new Date(date.setSeconds(date.getSeconds() + item.exp)).getTime();

            item.value = value;

            var deferred = $q.defer();

            $localForage.setItem(key, item).then(function() {
              deferred.resolve();
            }, function() {
              deferred.reject();
            });

            return deferred.promise;
          },
          getItem:function(key) {
            var deferred = $q.defer();

            $localForage.getItem(key).then(function(item) {
              verifyItem(item, key).then(function(item) {
                deferred.resolve(item.value);
              });

            }, function() {
              deferred.resolve(null);
            });

            return deferred.promise;
          },
          removeItem: function(key) {
            return $localForage.removeItem(key);
          },
          iterate: function(callback) {
            var deferred = $q.defer();

            $localForage.iterate(function(item, key) {
              verifyItem(item, key).then(function(item) {
                if(!item.isNull && item.value === null) return;
                callback(item.value, key);
              });
            }).then(function success(item) {
              deferred.resolve(item);
            }, function error(data) {
              deferred.reject();
            });

            return deferred.promise;
          }
      };
      return BidgelyStorage;
    });
