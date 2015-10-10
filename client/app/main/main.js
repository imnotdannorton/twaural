'use strict';

angular.module('twauralApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/:tag', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/tweet/:id', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });
