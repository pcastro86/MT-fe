(function(){
    'use strict';
        angular
            .module('app')
            .component('clusterComponent', {
                bindings: {},
                templateUrl : 'app/cluster/cluster.html',
                controller : clusterCtrl
            })

            
            function clusterCtrl($scope){}
}());