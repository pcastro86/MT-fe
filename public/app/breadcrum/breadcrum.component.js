(function(){
    'use strict';
        angular
            .module('breadcrum')
            .component('breadcrumComponent', {
                bindings: {
                    products: '<'
                },
                templateUrl : 'app/breadcrum/breadcrum.html',
                controller : breadcrumCtrl
            })


            breadcrumCtrl.$inject = ['$scope']
            
            function breadcrumCtrl($scope){
                }
}());

