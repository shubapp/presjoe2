var presJoe = angular.module('presJoe',[]);


// directives section
presJoe.directive('scrollPosition', function($window) {
  return function(scope, element, attrs) {
    var windowEl = angular.element($window);
    windowEl.on('scroll', function() {
      scope.$apply(function() {
        scope[attrs.scrollPosition] = windowEl.scrollTop();
      });
    });
  };
});

presJoe.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

//routes section
presJoe.config(function ($routeProvider) {
	$routeProvider
	.when('/presentations',{
		controller:'simpleCtrl',
		templateUrl: 'views/presentations.html'
	})
	.when('/new-presentation',{
		controller:'simpleCtrl',
		templateUrl: 'newPres.html'
	})
	.otherwise({redirectTo:'/presentations'});
});


// controlers section
var controllers = {};

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
	$http.get('api_mock/presentations.json').success(function(data) {
		$scope.presentations = data;
	});

	$scope.addPresentation = function() {
		alert("Shtuty");
		$scope.presentation.push({
			thumbnail: title1,
			desc: desc1
		});
	};

	$scope.shtuty = function() {
		alert("Shtuty");
	};	

	$scope.shtuty2 = function() {
		alert("Bye");
	};

	$scope.loadMore = function() {
        for (var i = 0; i < 4; i++) {
            $scope.presentations.push({thumbnail:"bla"+(i+2)+".jpg", desc:i});
        }
    };

    
};


presJoe.controller(controllers);