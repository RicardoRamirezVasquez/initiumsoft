(function () {
    'use strict';
    angular
      .module('money') 
      .directive('moneyMask', moneyMask);
      moneyMask.$inject = ['$filter', '$window','APP_LOCAL'];
      function moneyMask($filter, $window,APP_LOCAL) {
      var directive = {
        require: 'ngModel',
        link: link,
        restrict: 'A',
        scope: {
          model: '=ngModel'
        }
      };
      return directive;
  
      function link(scope, element, attrs, ngModelCtrl) {
        var display, cents;

        var APP_LOCAL =  {
          'local': 'EN-US'
        };

        if(!attrs.moneyMaskFixed){
          attrs.moneyMaskFixed = 2;
        }
  
        ngModelCtrl.$render = function () {

         var num = cents / Math.pow(10,attrs.moneyMaskFixed);
         display = num.toLocaleString(APP_LOCAL.local,{ minimumFractionDigits: attrs.moneyMaskFixed, maximumFractionDigits: attrs.moneyMaskFixed });

          if (attrs.moneyMaskPrepend) {
            display = attrs.moneyMaskPrepend + ' ' + display;
          }
  
          if (attrs.moneyMaskAppend) {
            display = display + ' ' + attrs.moneyMaskAppend;
          }
  
          element.val(display);
        };
  
        scope.$watch('model', function onModelChange(newValue) {
          newValue = parseFloat(newValue) || 0;
  
          if (newValue !== cents) {
            cents = Math.round(newValue * Math.pow(10,attrs.moneyMaskFixed));
          }
  
          ngModelCtrl.$viewValue = newValue;
          ngModelCtrl.$render();
        });
  
        element.on('keydown', function (e) {
          if ((e.which || e.keyCode) === 8) {
            cents = parseInt(cents.toString().slice(0, -1)) || 0;
  
            ngModelCtrl.$setViewValue(cents / Math.pow(10,attrs.moneyMaskFixed));
            ngModelCtrl.$render();
            scope.$apply();
            e.preventDefault();
          }
        });
  
        element.on('keypress', function (e) {
          var key = e.which || e.keyCode;
          
          if(key === 9 || key === 13) {
            return true;
          }
          
          var char = String.fromCharCode(key);
          e.preventDefault();

          /*First Character*/
          if (cents === 0){
            if (char.search(/[\-]/) === 0) {
              /*First Character is Minus*/ 
              scope.previousCharWasMinus = true;
            }
            else {
              if (char.search(/[0-9]/) === 0) {
                if (angular.isUndefined(scope.previousCharWasMinus) || scope.previousCharWasMinus === null ){
                  /*First Character Was Not Minus*/ 
                  scope.negative = false;
                }
                else {
                  if (scope.previousCharWasMinus === true){
                      /*First Character Was Minus*/ 
                    scope.negative = true;
                  }
                  else {
                      /*First Character Was Not Minus*/ 
                    scope.negative = false;
                  }
                }
                scope.previousCharWasMinus = false;
                cents = parseInt(cents + char);
              }
            }
          } 
          else {
            /*Not First Character Treatment*/
            if (char.search(/[0-9]/) === 0) {
              cents = parseInt(cents + char);
            }
            else {
              return false;
            }
          }
          var viewVal2 = Math.abs(cents) / Math.pow(10,attrs.moneyMaskFixed);
          if (scope.negative === true){
            viewVal2 = viewVal2 * -1;
          }
          ngModelCtrl.$setViewValue(viewVal2);
          ngModelCtrl.$render();
          scope.$apply();
        });
      }
    }
  })();