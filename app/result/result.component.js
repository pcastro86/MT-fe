if (function () {
    'use strict';
    angular
        .module('result')
        .component('resultComponent', {
            bindings: {
                products: '<'
            },
            templateUrl: 'app/result/result.html',
            controller: resultCtrl
        })

    resultCtrl.$inject = ['$scope', '$location']

    function resultCtrl($scope, $location) {
        this.noData = false;
        this.product = function (id) {
            $location.path("/item/" + id);
        }
    }
}());