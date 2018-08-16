(function(){
    'use strict';
        angular
            .module('detail', [])
            .component('detailComponent', {
                bindings: {},
                templateUrl : 'app/detail/detail.html',
                controller : detailCtrl
            })

            
            detailCtrl.$inject = ['$scope', 'seachService',  '$routeParams','$location']

            function detailCtrl($scope, seachService, $routeParams, $location){
                console.log($routeParams)

                
                this.$onChanges = function getDescription() {
                    var _this = this;
                
                    seachService.getDescription($routeParams.id).then(function (response) {
                        _this.description = JSON.parse(response.data.body);
                        console.log('descripcion', _this.description);
                    }).catch(function (error) {
                        console.log('no se pudo conectar', error);
                    });
                };
                
                this.$onInit = function getProduct() {
                    var _this = this;
                
                    seachService.getProduct($routeParams.id).then(function (response) {
                        _this.product = JSON.parse(response.data.body);
                        console.log(_this.product);
                    }).catch(function (error) {
                        console.log('no se pudo conectar', error);
                    });
                };

            }
}());