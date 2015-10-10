'use strict'
angular.module('twauralApp').service('sampleService', ['$http', function ($http) {
	// body...
	var endpoint = "https://hackathon.indabamusic.com/samples"
	var key = "ab68rlMaeCOGKVCA0sqTE0EdxC4IyFjbSCZjic9K"
	var uuid = "68a4d4da-6e25-11e5-99ff-0e52404cc67c"

	this.fetchLoops = function(instruments){
		return $http.get(endpoint + '?type=loop&instruments='+instruments)
	}
	this.fetchLoopsByTempo = function(tempo, instruments){
		if(tempo < 80){
			tempo = 80 + tempo;
		}
		return $http.get(endpoint + '?type=loop&tempo='+tempo)
	}
	this.fetchPackage = function(id){
		return $http.get(endpoint + '?package_id='+id)
	}
	this.fetchSamples = function(key){
		return $http.get(endpoint + '?type=one_shot&musical_key='+key)
	}
}]);