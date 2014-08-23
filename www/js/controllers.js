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

.controller('AppsCtrl', function($scope, Pebble) {
	$scope.sports = Pebble.sports;
	$scope.golf = Pebble.golf;
})

