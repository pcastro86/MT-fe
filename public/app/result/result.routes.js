(function(){
    'use strict';
        angular
            .module('app')
            .config(function($routeProvider) { 
                $routeProvider
                    .when('/', {
                        template: '<result-component></result-component>',
                    })
                    .when('/item/:id', {
                        template: '<detail-component></detail-component>',
                    })
            });
 }());