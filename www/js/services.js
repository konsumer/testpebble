angular.module('starter.services', [])

/**
 *  Angular wrapper for Pebble cordova plugin
 */
.factory('Pebble', function($q, $rootScope) {
  var PebbleFactory = {
    connected: false,
    firmware: {},
    uuid: {}
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
    PebbleFactory.uuid = uuid;
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

  PebbleFactory.updateSports = function(time, distance, pace){
    var deferred = $q.defer();
    
    var data = {};
    data[Pebble.SPORTS_TIME_KEY] = time;
    data[Pebble.SPORTS_DISTANCE_KEY] = distance + ".0";
    data[Pebble.SPORTS_DATA_KEY] = pace;
    data[Pebble.SPORTS_LABEL_KEY] = Pebble.SPORTS_DATA_PACE;

    console.log(data);

    Pebble.sendDataToPebble(Pebble.SPORTS_UUID, data, function(err, uuid){
      if (err) return deferred.reject(err);
      deferred.resolve(uuid);
    });

    return deferred.promise;
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

  document.addEventListener("backbutton", function(event){
    Pebble.closeAppOnPebble(PebbleFactory.uuid);
  }, true);

  return PebbleFactory;
});
