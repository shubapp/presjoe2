'use strict';
var presJoe = angular.module('presJoe.directives',[]);

var directives = {};

// directives section
directives.scrollPosition=function($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var windowEl = angular.element($window);
            windowEl.on('scroll', function() {
                scope.$apply(function() {
                    scope[attrs.scrollPosition] = windowEl.scrollTop();
                });
            });
        }
    };
};

directives.whenScrolled=function($window) {
    return {
        restrict: 'A',
        link: function(scope, elm, attr) {
            var windowEl = angular.element($window);
            windowEl.on('scroll', function() {
                console.log(scope.scroll+ " " +elm.height());
                if (scope.scroll >= elm.height()*0.3) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        //     var raw = elm[0];
        //     console.log(scope.scroll);

        //     elm.bind('scroll', function() {
        //         console.log('scrolledddd');
        //         if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        //             scope.$apply(attr.whenScrolled);
        //         }
        //     });
        }
    };
};

directives.modal=function() {
    return {
        restrict: 'C',
        templateUrl:'views/viewPres.html',
        link: function(scope, elm, attr) {
            elm.find('.close').bind('click',function(){
                $('#presModal').addClass('invisible');
                $('#presModal iframe').attr('src','');
            });
        }
    };
};


directives.showpres=function() {
    return {
        restrict: 'A',
        link: function(scope, elm, attr) {
            elm.bind('click',function(){
                console.log(scope.pres.contents);
                console.log($('#presModal iframe').attr('src')!='js/lib/ViewerJS/#../../../upload/'+scope.pres.contents);
                if($('#presModal iframe').attr('src')!='js/lib/ViewerJS/#../../../upload/'+scope.pres.contents){
                    $('#presModal iframe').attr('src','js/lib/ViewerJS/#../../../upload/'+scope.pres.contents);
                    $('#titleName').text(attr.showpres);
                }
                $('#presModal').removeClass('invisible');
            });
        }
    };
};

presJoe.directive(directives);