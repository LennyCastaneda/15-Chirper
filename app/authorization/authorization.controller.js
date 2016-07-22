
//Creating Authorization controller to pass user inputs from the view to Authorization factory

(function() {
    'use strict';

    angular
        .module('app')
        .controller('AuthorizationController', AuthorizationController);

    AuthorizationController.$inject = ['AuthorizationFactory', '$state'];

    /* @ngInject */
    function AuthorizationController(AuthorizationFactory, $state) {
        var vm = this;
        vm.title = 'AuthorizationController';
        vm.registerUser = registerUser;
        vm.loginUser = loginUser;
        vm.logoutUser = logoutUser;
        vm.showLogin = showLogin;
        vm.showRegister = showRegister;

        activate();

        ////////////////

        function activate() {}

        //Defining registerUser function to call registerUser method in Authorization Factory

        function registerUser(userEmail, password, confirmPassword) {
            AuthorizationFactory.registerUser(userEmail, password, confirmPassword).then(function(response) {

                    toastr.success('User successfully registered!');

                    vm.userName = '';
                    vm.userEmail = '';
                    vm.password = '';
                    vm.confirmPassword = '';

                    showLogin();

                },
                function(error) {
                    if (typeof error === 'object') {
                        toastr.error('There was an error: ' + error.data);
                    } else {
                        toastr.error(error);
                    }
                });
        }

        //Defining loginUser to call loginUser method in AuthorizationFactory and redirect user to chirper mainpage on successful login

        function loginUser(loginEmail, loginPassword) {
            logoutUser();
            AuthorizationFactory.loginUser(loginEmail, loginPassword).then(function(response) {

                    vm.loginData = response.data;

                    toastr.success('User successfully logged in!');

                    vm.loginEmail = '';
                    vm.loginPassword = '';

                    $state.go('chirps');
                },
                function(error) {
                    if (typeof error === 'object') {
                        toastr.error('There was an error: ' + error.data);
                    } else {
                        toastr.error(error);
                    }
                });
        }

        //Defining logoutUser to call logoutUser method in AuthorizationFactory and redirect user to login page upon clearing access_token from local storage
        function logoutUser() {
            AuthorizationFactory.logoutUser();
            $state.go('home');
        }

        //Defining methods to show either login or register form
        function showLogin() {
            $("#login-form").delay(100).fadeIn(100);
            $("#register-form").fadeOut(100);
            $('#register-form-link').removeClass('active');
            $("#login-form-link").addClass('active');
        }

        function showRegister() {
            $("#register-form").delay(100).fadeIn(100);
            $("#login-form").fadeOut(100);
            $('#login-form-link').removeClass('active');
            $('#register-form-link').addClass('active');
        }
    }
})();
