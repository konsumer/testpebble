angular.module('starter.services', [])

.factory('Pebble', function($q, $rootScope) {
  var PebbleFactory = {
    connected: false,
    firmware: {}
  };
  PebbleFactory.alert = function(title, body, sender){
    var deferred = $q.defer();
    sender = sender || 'CordovaPebble';
    Pebble.alert(sender, title, body, function(err, result){
      if (err) return deferred.reject(err);
      deferred.resolve(result);
    });
    return deferred.promise;
  }

  PebbleFactory.music = function(artist, album, track){
    var deferred = $q.defer();
    Pebble.music(artist, album, track, function(err, result){
      if (err) return deferred.reject(err);
      deferred.resolve(result);
    });
    return deferred.promise;
  }

  PebbleFactory.app = function(uuid){
    var deferred = $q.defer();
    Pebble.startAppOnPebble(uuid, function(err, result){
      if (err) return deferred.reject(err);
      deferred.resolve(result);
    });
    return deferred.promise;
  }

  PebbleFactory.golf = function(){
    return PebbleFactory.app(Pebble.GOLF_UUID);
  }

  PebbleFactory.sports = function(){
    return PebbleFactory.app(Pebble.SPORTS_UUID);
  }

  var handleConnected = function(err, connected){
    if (err) return;
    PebbleFactory.connected = connected;
    if (connected){
      Pebble.getWatchFWVersion(function(err, fw){
        PebbleFactory.firmware = fw;
        $rootScope.$broadcast('pebble.connected', fw);
      });
    }
  };

  PebbleFactory.checkConnected = function(){
    var deferred = $q.defer();
    Pebble.isWatchConnected(function(err, connected){
      if (err) return deferred.reject(err);
      handleConnected(err, connected);
      deferred.resolve(connected);
    });
    return deferred.promise;
  }

  document.addEventListener('deviceready', function() {
    Pebble.registerPebbleConnectedReceiver(handleConnected);
    Pebble.registerPebbleDisconnectedReceiver(function(err, connected){
      if (err) return;
      PebbleFactory.connected = false;
      $rootScope.$broadcast('pebble.disconnected');
    });
  });

  return PebbleFactory;
});
