
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
                    vm.chirps.push(response.data);
                    toastr.success('Chirp Successfully Posted!');
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

        function likesManager(chirp) {

            var likeId;
            var chirpIndex = vm.chirps.indexOf(chirp);
            var likedIndex;
            var hasLiked = false;
            
            angular.forEach(chirp.Likes, function(value, index){
                if(value.User.Email === vm.username){
                    hasLiked = true;
                    likeId = chirp.Likes[index].LikeId;
                    likedIndex = index;
                }
            });

            if(hasLiked === true){
                unlikeChirp(likeId);
                vm.chirps[chirpIndex].Likes.splice(likedIndex, 1);
            }
            else{
                likeChirp(chirp.ChirpId, chirpIndex);
            }

        }

        //Adds a like to a chirp based on the chirpId

        function likeChirp(chirpId, chirpIndex) {

            ChirpFactory.likeChirp(chirpId).then(function(response) {
                    vm.chirps[chirpIndex].Likes.push(response.data);
                    toastr.success('Chirp Liked!');
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

        function postComment(commentText, chirp) {

            var chirpIndex = vm.chirps.indexOf(chirp);

            ChirpFactory.postComment(commentText, chirp.ChirpId).then(function(response) {

                    vm.chirps[chirpIndex].Comments.push(response.data);
                    toastr.success('Comment Successfully Posted!');
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
