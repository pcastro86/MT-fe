(function () {
    'use strict';
    angular
        .module('app')
        .config(function ($routeProvider) {
            $routeProvider
                .when('/item/:id', {
                    template: '<detail-component></detail-component>',
                })
        });
}());