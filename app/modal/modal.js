
//Custom directive for displaying a modal

(function() {
    'use strict';

    angular
        .module('app')
        .directive('modal', modal);

    modal.$inject = [];

    /* @ngInject */
    function modal() {
        // Usage: Used to display a custom modal from a template
        //
        // Creates: Modal object from template
        //
        var directive = {
            templateUrl: '../../templates/modal.html',
            transclude: true,
      		  replace:true,
            restrict: 'E',
            scope: false,
            link: postLink,
        };
        return directive;

        function postLink(scope, element, attrs) {
          scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    }

})();
