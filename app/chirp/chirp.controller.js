
//Creating Chirp Controller to pass user input from view to Chirp factory

(function() {
    'use strict';

    angular
        .module('app')
        .controller('ChirpController', ChirpController);

    ChirpController.$inject = ['ChirpFactory', 'AuthorizationFactory', 'localStorageService' , '$state'];

    /* @ngInject */
    function ChirpController(ChirpFactory, AuthorizationFactory, localStorageService, $state) {
        var vm = this;
        vm.title = 'ChirpController';
        vm.getChirps = getChirps;
        vm.postChirp = postChirp;
        vm.likesManager = likesManager;
        vm.likeChirp = likeChirp;
        vm.unlikeChirp = unlikeChirp;
        vm.postComment = postComment;
        vm.logoutUser = logoutUser;

        vm.showmodal = false;
        vm.username = localStorageService.get('username');

        activate();

        ////////////////

        function activate() {
            getChirps();

        }

        //Get Function calls Chirps Factory to get all Chirps from database and returns them to model array

        function getChirps() {

            ChirpFactory.getChirps()
                .then(function(response) {

                        vm.chirps = response.data;
                        toastr.success('Chirps Loaded!');


                    },
                    function(error) {
                        if (typeof error === 'object') {
                            toastr.error('There was an error: ' + error.data);
                        } else {
                            toastr.info(error);
                        }
                    })
        }

        //Post Function calls Chirps Factory to POST item to Database and pushes returned item to model array

        function postChirp(chirpText) {

            ChirpFactory.postChirp(chirpText).then(function(response) {

                    toastr.success('Chirp Successfully Posted!');
                    getChirps();
                },
                function(error) {
                    if (typeof error === 'object') {
                        toastr.error('There was an error: ' + error.data);
                    } else {
                        toastr.info(error);
                    }
                });
        }

        //Checks chirps to see if they have been previously liked by logged in User and likes or unlikes accordingly

        function likesManager(chirpId, likes) {
            var likeId;
            var hasLiked = false;

            angular.forEach(likes, function(value, index){
                if(value.User.Email = vm.username){
                    hasLiked = true;
                    likeId = likes[index].LikeId;
                }
            });

            if(hasLiked === true){
                unlikeChirp(likeId);
            }
            else{
                likeChirp(chirpId);
            }

        }

        //Adds a like to a chirp based on the chirpId

        function likeChirp(chirpId) {
            ChirpFactory.likeChirp(chirpId).then(function(response) {

                    toastr.success('Chirp Liked!');
                    getChirps();
                },
                function(error) {
                    if (typeof error === 'object') {
                        toastr.error('There was an error: ' + error.data);
                    } else {
                        toastr.info(error);
                    }
                });
        }


        //Removes a like from a chirp based on the likeId

        function unlikeChirp(likeId) {
            ChirpFactory.unlikeChirp(likeId).then(function(response) {

                    toastr.success('Chirp unliked!');
                    getChirps();
                },
                function(error) {
                    if (typeof error === 'object') {
                        toastr.error('There was an error: ' + error.data);
                    } else {
                        toastr.info(error);
                    }
                });
        }

        //Posts a comment to a chirp based on its ChirpId

        function postComment(commentText, chirpId) {

            ChirpFactory.postComment(commentText, chirpId).then(function(response) {

                    toastr.success('Comment Successfully Posted!');
                    getChirps();
                },
                function(error) {
                    if (typeof error === 'object') {
                        toastr.error('There was an error: ' + error.data);
                    } else {
                        toastr.info(error);
                    }
                });
        }

        //Defining logoutUser to call logoutUser method in AuthorizationFactory and redirect user to login page upon clearing access_token from local storage
        function logoutUser() {
            AuthorizationFactory.logoutUser();
            $state.go('home');
            toastr.success('User successfully logged out!')
        }
    }
})();
