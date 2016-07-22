
//Creating Chirp Factory to handle Chirp, Like and Comment calls to database

(function() {
    'use strict';

    angular
        .module('app')
        .factory('ChirpFactory', ChirpFactory);

    ChirpFactory.$inject = ['$http', '$q', 'localStorageService', 'jwtHelper' ];

    /* @ngInject */
    function ChirpFactory($http, $q, localStorageService, jwtHelper) {

    	var url = 'http://localhost:50415/api/chirps/'
        var service = {
            getChirps: getChirps,
            postChirp: postChirp,
            likeChirp: likeChirp,
            unlikeChirp: unlikeChirp,
            postComment: postComment
        };
        return service;

        ////////////////

        // Gets Chirps using GET API Call

        function getChirps() {

            var defer = $q.defer();

            $http({
                method: 'GET',
                url: url
            }).then(function(response) {
                    if (typeof response.data === 'object') {
                    	//response.push(userData);
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

        //Post Chirps using POST API Call

        function postChirp(chirpText){

            var defer = $q.defer();

            var newChirp = {text: chirpText};

            $http({
                    method: 'POST',
                    url: url, 
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: newChirp
                }).then(function(response) {
                        if (typeof response.data === 'object') {
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

        //Post new Like to database using POST API Call

        function likeChirp(chirpId){

        	var defer = $q.defer();
            var like = {chirpId: chirpId};

            $http({
                method: 'POST',
                url: 'http://localhost:50415/api/likes',
                headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                },
                data: like
            }).then(function(response) {
                    if (typeof response.data === 'object') {
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

        //Delete Like from database using DELETE API Call

        function unlikeChirp(likeId){
            var defer = $q.defer();

            $http({
                method: 'DELETE',
                url: 'http://localhost:50415/api/likes/' + likeId,
            }).then(function(response) {
                    if (typeof response.data === 'object') {
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

        //Post Comment using POST API Call

        function postComment(commentText, chirpId){

            var defer = $q.defer();

            var newComment = {text: commentText, chirpId: chirpId};

            $http({
                    method: 'POST',
                    url: 'http://localhost:50415/api/comments/', 
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    data: newComment
                }).then(function(response) {
                        if (typeof response.data === 'object') {
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
    }
})();