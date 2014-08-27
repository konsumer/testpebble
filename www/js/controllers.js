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

.controller('AppsCtrl', function($scope, Sports, Golf, Pebble, $interval) {
	var i;
	
	$scope.sports = function(){
		$interval.cancel(i);
		var count = 0;
		Sports.start()
			.then(function(){
				i = $interval(function(){
					if (count >= 10){ 
						$interval.cancel(i);
						Sports.stop();
						return;
					}
					time = "0" + count + ":00";
					Sports.update(time, count, time);
					count++;
				}, 1000);
			});
	}

	$scope.golf = function(){
		$interval.cancel(i);
		var count = 0;
		Golf.start()
			.then(function(){
				i = $interval(function(){
					if (count >= 10){ 
						$interval.cancel(i);
						Golf.stop();
						return;
					}
					Golf.update(count-1, count, count+1, count+2, count+3);
					count++;
				}, 1000);
			});
	};
})

