
//Creating Authorization Interceptor for managing HTTP requests and responses

(function() {
    'use strict';

    angular
        .module('app')
        .factory('AuthorizationInterceptor', AuthorizationInterceptor);

    AuthorizationInterceptor.$inject = ['localStorageService'];

    /* @ngInject */
    function AuthorizationInterceptor(localStorageService) {
        var service = {
            request: request
        };
        return service;

        ////////////////

        //Interceptor appends Authorization header with access token from local storage on all requests except login
        
        function request(config) {

        	config.headers = config.headers || {};
        	var access_token = localStorageService.get('access_token');

        	if(access_token){
        		config.headers['Authorization'] = 'Bearer ' + access_token;
        	}

        	return config;
        }
    }
})();