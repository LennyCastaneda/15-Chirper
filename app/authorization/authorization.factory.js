
//Creating factory to handle authorization related services

(function() {
    'use strict';

    angular
        .module('app')
        .factory('AuthorizationFactory', AuthorizationFactory);

    AuthorizationFactory.$inject = ['$q', '$http','localStorageService'];

    /* @ngInject */
    function AuthorizationFactory($q, $http, localStorageService) {
        var service = {
            registerUser: registerUser,
            loginUser: loginUser,
            logoutUser: logoutUser
        };
        return service;

        ////////////////


        //Defining Method for Registering User in database with POST to API

        function registerUser(userEmail, password, confirmPassword) {

        	var defer = $q.defer();

        	if (password !== confirmPassword){
        		defer.reject("Password must match Confirm Password.");

        		return defer.promise;
        	}

            var newUser = {emailAddress: userEmail, password: password, confirmPassword: confirmPassword};

            $http({
                    method: 'POST',
                    url: 'http://localhost:50415/api/accounts/register',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: newUser
                }).then(function(response) {
                        if (response.status === 200) {
                            defer.resolve(response);
                        } else {
                            defer.reject("No data found!");
                        }
                    },
                    function(error) {
                        defer.reject("Email Address has already been used!");
                    });

                return defer.promise;
        }

        //Defining method for logging users in upon user registration

        function loginUser(loginEmail, loginPassword){
        	var defer = $q.defer();

            var data = "grant_type=password&username=" + loginEmail + "&password=" + loginPassword;

            $http({
                    method: 'POST',
                    url: 'http://localhost:50415/api/token',
                    headers: {
                    	'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: data
                }).then(function(response) {
                        if (response.status === 200) {

                            localStorageService.set('access_token', response.data.access_token);
                            localStorageService.set('username', loginEmail);

                            defer.resolve(response);
                        } else {
                            defer.reject("No data found!");
                        }
                    },
                    function(error) {
                        defer.reject(error);
                    });

                return defer.promise;
        }

        //Defining method for logging users out by clearing out access token from local storage
        
        function logoutUser(){
        	localStorageService.clearAll();

        }
    }
})();