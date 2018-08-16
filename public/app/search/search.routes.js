(function(){
    'use strict';
        angular
            .module('app')
            .config(function($routeProvider) { 
                $routeProvider
                    .when('/', {
                        template: '<search-component></search-component>',
                    })
                    // .when('/item/:id', {
                    //     template: '<search-component></search-component>',
                    // })
            });
 }());