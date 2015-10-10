'use strict'
angular.module('twauralApp').service('tweetService', ['$http', function ($http) {

	this.fetchByTag = function(tag){
		return $http.get('/api/tweets/'+tag)
	}
	// this.fetchByTag = function(id){
	// 	return $http.get('/tweets/id'+tag)
	// }
}]);