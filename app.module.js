
(function () {
    'use strict';
    angular
        .module('app', ['ngRoute', 'cluster'])
        .config(appConfig);

    appConfig.$inject = ['$routeProvider', '$locationProvider'];

    function appConfig($routeProvider, $locationProvider) {
        $routeProvider

            .otherwise({
                redirectTo: '/'
            });

    }
}());