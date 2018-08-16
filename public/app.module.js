
(function(){
    'use strict';
        angular
            .module('app', ['ngRoute','cluster' ])
            .config(appConfig);

            appConfig.$inject = ['$routeProvider'];

           function appConfig( $routeProvider){
            $routeProvider
        
            .otherwise({
                redirectTo: '/'
            });
           }
 }());