angular.module('starter.services', [])

/**
 *  Angular wrapper for Pebble cordova plugin
 */
.factory('Pebble', function($q, $rootScope) {
  var PebbleFactory = {
    connected: false,
    firmware: {}
  };
  
  /**
   * send an alert to pebble
   * @param  {String} title  Titleof message
   * @param  {String} body   Body of message
   * @param  {String} sender Name of app sending this
   * @return {Promise}       Resolves on success, rejects on error
   */
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

  PebbleFactory.stop = function(uuid){
    var deferred = $q.defer();
    Pebble.closeAppOnPebble(uuid, function(err, result){
      if (err) return deferred.reject(err);
      deferred.resolve(result);
    });
    return deferred.promise;
  }

  PebbleFactory.data = function(uuid, data){
    var deferred = $q.defer();
    
    console.log('data', data);

    Pebble.sendDataToPebble(uuid, data, function(err, result){
      if (err) return deferred.reject(err);
      deferred.resolve(result);
    });
    return deferred.promise;
  }

  PebbleFactory.checkConnected = function(){
    var deferred = $q.defer();
    Pebble.isWatchConnected(function(err, connected){
      if (err) return deferred.reject(err);
      handleConnected(err, connected);
      deferred.resolve(connected);
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

  document.addEventListener('deviceready', function() {
    Pebble.registerPebbleConnectedReceiver(handleConnected);
    Pebble.registerPebbleDisconnectedReceiver(function(err, connected){
      if (err) return;
      PebbleFactory.connected = false;
      $rootScope.$broadcast('pebble.disconnected');
    });
  });

  return PebbleFactory;
})

.factory('Sports', function($q, Pebble){
  var SportsFactory = {};
  
  var isPaceLabel = true;
  var useMetric = false;

  // from constants
  var SPORTS_UUID = "4dab81a6-d2fc-458a-992c-7a1f3b96a970";
  var SPORTS_TIME_KEY = 0;
  var SPORTS_DISTANCE_KEY = 1;
  var SPORTS_DATA_KEY = 2;
  var SPORTS_UNITS_KEY = 3;
  var SPORTS_STATE_KEY = 4;
  var SPORTS_LABEL_KEY = 5;
  var SPORTS_UNITS_IMPERIAL = 0;
  var SPORTS_UNITS_METRIC = 1;
  var SPORTS_DATA_SPEED = 0;
  var SPORTS_DATA_PACE = 1;

  SportsFactory.start = function(){
    return Pebble.app(SPORTS_UUID);
  }

  SportsFactory.stop = function(){
    return Pebble.stop(SPORTS_UUID);
  }

  SportsFactory.update = function(time, distance, addl_data){
    data =[];
    data.push({ "key": SPORTS_TIME_KEY, "value": time, "length":0, "type":"string" });
    data.push({ "key": SPORTS_DISTANCE_KEY, "value": distance, "length":0, "type":"string" });
    data.push({ "key": SPORTS_DATA_KEY, "value": addl_data, "length":0, "type":"string" });
    data.push({ "key": SPORTS_LABEL_KEY, "value": isPaceLabel ? SPORTS_DATA_SPEED : SPORTS_DATA_PACE, "length":0, "type":"uint" });
    return Pebble.data(SPORTS_UUID, data);
  }

  SportsFactory.changeUnits = function(){
    var data = {};
    data[SPORTS_UNITS_KEY] = useMetric ? SPORTS_UNITS_METRIC : SPORTS_UNITS_IMPERIAL;
    useMetric = !useMetric;
    return Pebble.data(SPORTS_UUID, data);
  }

  return SportsFactory;
})

.factory('Golf', function($q, Pebble){
  var GolfFactory = {};

  // from constants
  var GOLF_UUID = "cf1e816a-9db0-4511-bbb8-f60c48ca8fac";
  var GOLF_FRONT_KEY = 0;
  var GOLF_MID_KEY = 1;
  var GOLF_BACK_KEY = 2;
  var GOLF_HOLE_KEY = 3;
  var GOLF_PAR_KEY = 4;

  GolfFactory.start = function(){
    return Pebble.app(GOLF_UUID);
  }

  GolfFactory.stop = function(){
    return Pebble.stop(GOLF_UUID);
  }

  GolfFactory.update = function(hole, par, back, mid, front){
    data =[];
    data.push({ "key": GOLF_HOLE_KEY, "value": hole + "", "length":0, "type":"string" });
    data.push({ "key": GOLF_PAR_KEY, "value": par + "", "length":0, "type":"string" });
    data.push({ "key": GOLF_BACK_KEY, "value": back + "", "length":0, "type":"string" });
    data.push({ "key": GOLF_MID_KEY, "value": mid + "", "length":0, "type":"string" });
    data.push({ "key": GOLF_FRONT_KEY, "value": front + "", "length":0, "type":"string" });
    return Pebble.data(GOLF_UUID, data);
  }

  return GolfFactory;
})
