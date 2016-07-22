
//Creating module for to handle ui-routing, localStorage, and Interceptor

(function() {
    'use strict';

    var app = angular.module('app', ['ui.router', 'LocalStorageModule', 'angular-jwt']);

    app.config(function(localStorageServiceProvider, $stateProvider, $urlRouterProvider, $httpProvider ) {

    	$httpProvider.interceptors.push('AuthorizationInterceptor');

        localStorageServiceProvider
            .setPrefix('app')
            .setStorageType('localStorage')
            .setNotify(true, true)

        $urlRouterProvider.otherwise('/home');
	    
	    $stateProvider

	    	// HOME STATES AND NESTED VIEWS ========================================
	        .state('home', {
	            url: '/home',
	            templateUrl: '../partials/partial-home.html',
	            controller: 'AuthorizationController',
	            controllerAs: 'vm'
	        })
	        
	        // MULTIPLE ADDITIONAL STATES AND NESTED VIEWS =========================
	        .state('chirps', {
	            url: '/chirps',
	            templateUrl: '../partials/partial-chirps.html',
	            controller: 'ChirpController',
	            controllerAs: 'vm'
	        })

    });
})();
