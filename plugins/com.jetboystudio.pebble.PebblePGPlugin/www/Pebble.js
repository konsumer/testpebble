var cordova = require('cordova');

/*
// every method has node-style callback as last argument: function(error, result)
// if last arg is not a function, use it as arg
var cordova_exec = function(method, args){
	if (args.length){
		callback = args.pop();
		if (typeof(callback) !== 'function'){ args.push(callback); }
	}
	cordova.exec(function(result){
		callback(null, result);
	}, callback, "Pebble", method, args);
}
*/

var Pebble = {};

Pebble.isWatchConnected = function(cb){
	cordova.exec(function(result){
		cb(null, result);
	}, cb, 'Pebble', 'isWatchConnected', []);
}


module.exports = Pebble;