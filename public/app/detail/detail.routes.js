(function(){
    'use strict';
        angular
            .module('detail')
            .config(function($routeProvider) { 
                $routeProvider
                    .when('/item/:id', {
                        // template : '<h1>hola</h1>'
                        // template: '<detail-component></detail-component>',
                    })
            });
 }());