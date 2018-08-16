angular
    .module('app')
    .service('seachService', seachService)

seachService.$inject = ['$http']


function seachService($http) {
    
    this.getProducts = function (buscar) {
        return $http({
            url: '/item?q=' + buscar,
            method: 'GET'
        })
    },

    this.getDescription = function (id) {
        return $http({
            url: '/item/' + id + '/description',
            method: 'GET'
        })
    }

    this.getProduct = function (id) {
        return $http({
            url: '/item/' + id ,
            method: 'GET'
        })
    }
}






