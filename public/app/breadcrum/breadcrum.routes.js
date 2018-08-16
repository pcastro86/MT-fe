(function(){
    'use strict';
        angular
            .module('app')
            .config(function($routeProvider) { 
                $routeProvider
                    .when('/', {
                        template: '<search-component></search-component>',
                    })
            });
 }());