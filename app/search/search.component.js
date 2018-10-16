(function () {
    'use strict';
    angular
        .module('app')
        .component('searchComponent', {
            bindings: {
            },
            templateUrl: 'app/search/search.html',
            controller: searchCtrl
        })

    searchCtrl.$inject = ['$scope', 'seachService']

    function searchCtrl($scope, seachService) {

        this.noData = false;

        this.search = function search(searchByName) {
            var _this = this;

            seachService.getProducts(searchByName).then(function (res) {
                _this.products = JSON.parse(res.data.body);
                _this.noData = true;
            }).catch(function (error) {
                console.log('no se pudo conectar', error);
            });
        };
    }
}());

