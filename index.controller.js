(function () {
    'use strict';
    angular.module('app', ['app.utils']).controller('HelloWorldCtrl', HelloWorldCtrl);
    HelloWorldCtrl.$inject = ['$scope'];
    function HelloWorldCtrl ($scope) {  
        var vm = this;
        vm.entity = {};
        function init(){
            angular.extend(
                vm.entity, {
                    money:1000
            });
        }
        init();
    } 
})();