'use strict';
var presJoe = angular.module('presJoe.directives',[]);
var directives = {};

var PRES_TYPES={
    URL:1,
    PDF:2
};

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
                var pdfPrefix= 'js/lib/ViewerJS/#../../../upload/';
                var frameSrc;
                if(scope.pres.type==PRES_TYPES.PDF){
                    frameSrc=pdfPrefix+ scope.pres.title + '/' +scope.pres.contents;
                }else if(scope.pres.type==PRES_TYPES.URL){
                    frameSrc = scope.pres.contents;
                }

                if($('#presModal iframe').attr('src')!=frameSrc){
                    $('#presModal iframe').attr('src',frameSrc);
                    $('#titleName').text(attr.showpres);
                }
                $('#presModal').removeClass('invisible');
            });
        }
    };
};

presJoe.directive(directives);