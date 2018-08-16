const endpoints = require(`${process.env.PWD}/server/resources/endpoints.js`)
const request = require('request');

module.exports = {

    getProducts(query){
       return new Promise(function(resolve, reject){
            const url = endpoints.items.url.replace(':query', query.q)
            request[endpoints.items.method](url, function (error, response, body) {
                if(error) {
                    reject(error)
                } else {
                    resolve({response, body})
                }
            })
        })
    },

    getProduct(id){
        return new Promise(function(resolve, reject){
            const url = endpoints.item.url.replace(':id', id.id)
            request[endpoints.item.method](url, function (error, response, body) {
                if(error) {
                    reject(error)
                } else {
                    resolve({response, body})
                }
            })
        })
    },

    getDescription(id){
        return new Promise(function(resolve, reject){
            const url = endpoints.description.url.replace(':id', id.id)
            request[endpoints.description.method](url, function (error, response, body) {
                if(error) {
                    reject(error)
                } else {
                    resolve({response, body})
                }
            })
        })
    },

    getCurrency(currency){
        return new Promise(function(resolve, reject){
            const url = endpoints.currency.url.replace(':currency', currency.currency)
            console.log(url)
            request[endpoints.currency.method](url, function (error, response, body) {
                if(error) {
                    reject(error)
                } else {
                    resolve({response, body})
                }
            })
        })
    }
}
