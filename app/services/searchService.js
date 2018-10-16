angular
    .module('app')
    .service('seachService', seachService)

seachService.$inject = ['$http']


function seachService($http) {

    this.getProducts = function (buscar) {
        return $http({
            url: 'http://localhost:5000/item?q=' + buscar,
            method: 'GET'
        })
    },

        this.getDescription = function (id) {
            return $http({
                url: 'http://localhost:5000/item/' + id + '/description',
                method: 'GET'
            })
        }

    this.getProduct = function (id) {
        return $http({
            url: 'http://localhost:5000/item/' + id,
            method: 'GET'
        })
    }
}






