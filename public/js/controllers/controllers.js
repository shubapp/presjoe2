'use strict';
var presJoe = angular.module('presJoe.controllers',[]);

var controllers={};

// controlers section
controllers.navbarController = function ($scope) {
	$scope.scroll = 0;
	$scope.filter={"name":""};

	$scope.reloadFilter= function() {
		$scope.filter.name = localStorage['search-query'];
	}

	$scope.filterChange = function() {
		localStorage['search-query'] = $scope.filter.name;
	}

	$scope.$on('$viewContentLoaded', $scope.reloadFilter());
};

controllers.simpleCtrl = function ($scope, $http) {
	$http.get('api/presentations').success(function(data) {
		$scope.presentations = data;
	});

	$scope.addPresentation = function() {
		//TODO: add a usage for this in the new pres html
		alert("Shtuty");
		$scope.presentation.push({
			thumbnail: title1,
			desc: desc1
		});
	};

	$scope.loadMore = function() {
        console.log("loadmore");
    };
};

presJoe.controller(controllers);