'use strict';

angular.module('twauralApp')
  .controller('MainCtrl', function($scope, $http, $route, socket) {
    console.log($route.current.params)
    $scope.activeTag = $route.current.params.tag
    $scope.activeId = $route.current.params.id

  });
