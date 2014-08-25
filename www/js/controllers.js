angular.module('starter.controllers', [])

.controller('InfoCtrl', function($scope, Pebble) {
	var updateState = function (event, data) {
		$scope.connected = Pebble.connected;
		if (Pebble.connected)
			$scope.firmware = Pebble.firmware;
		$scope.$apply();
	};
	$scope.$on('pebble.connected', updateState);
	$scope.$on('pebble.disconnected', updateState);
	
	document.addEventListener('deviceready', function() {
		Pebble.checkConnected();
	});
})

.controller('MessageCtrl', function($scope, Pebble) {
	$scope.alert = Pebble.alert;
})

.controller('MusicCtrl', function($scope, Pebble) {
	$scope.music = Pebble.music;
})

.controller('AppsCtrl', function($scope, Pebble, $interval, $timeout) {
	$scope.sports = function(){
		var count = 0;
		Pebble.sports();
		
		// upate data 10 times.
		$timeout(function(){
			var updater = $interval(function(){
				count++;
				if (count >= 10) return $interval.cancel(updater);
				var time = "0" + count + ":00";
				Pebble.updateSports(time, count, time);
			}, 1000);
		}, 1000)
	}

	$scope.golf = Pebble.golf;
})

