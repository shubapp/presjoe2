'use strict';
var presJoe = angular.module('presJoe',['presJoe.controllers','presJoe.directives','ngRoute']);

//routes section
presJoe.config(function ($routeProvider) {
	$routeProvider
	.when('/presentations',{
		controller:'simpleCtrl',
		templateUrl: 'views/presentations.html'
	})
	.when('/new-presentation',{
		controller:'simpleCtrl',
		templateUrl: 'views/newPres.html'
	})
	.otherwise({redirectTo:'/presentations'});
});