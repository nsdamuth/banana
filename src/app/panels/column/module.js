/*

  ## Column

  ### Parameters
  * panels :: an array of panel objects. All of their spans should be set to 12

*/
define([
  'angular',
  'app',
  'underscore',
  'config'
],
function (angular, app, _, config) {
  'use strict';

  var module = angular.module('kibana.panels.column', []);

  app.useModule(module);

  module.controller('column', function($scope, $rootScope, $timeout) {
    $scope.panelMeta = {
      status  : "Stable",
      description : "A pseudo panel that lets you add other panels to be arranged in a column with "+
        "defined heights."
    };

    // Set and populate defaults
    var _d = {
      panelColor: "#000000",
      panelBorderWidth: "0",
      panelBorderColor: "#FFFFFF",
      panelBorderRadius: "0",
      panelFontColor: "#999999",
      panelFontSize: "1.2vh",
      panelFontWeight: "inherit",
      panelButtonDisplay: "inherit",
      panels : []
    };
    _.defaults($scope.panel,_d);

    $scope.init = function(){
      $scope.reset_panel();
    };

    $scope.toggle_row = function(panel) {
      panel.collapse = panel.collapse ? false : true;
      if (!panel.collapse) {
        $timeout(function() {
          $scope.send_render();
        });
      }
    };

    $scope.send_render = function() {
      $scope.$broadcast('render');
    };

    $scope.add_panel = function(panel) {
      $scope.panel.panels.push(panel);
    };

    $scope.reset_panel = function(type) {
      $scope.new_panel = {
        loading: false,
        error: false,
        sizeable: false,
        span: 12,
        height: "150px",
        editable: true,
        type: type,
        draggable: false
      };
    };

  });

  module.directive('columnEdit', function($compile,$timeout) {
    return {
      scope : {
        new_panel:"=panel",
        row:"=",
        config:"=",
        dashboards:"=",
        type:"=type"
      },
      link: function(scope, elem) {
        scope.$on('render', function () {

          // Make sure the digest has completed and populated the attributes
          $timeout(function() {
            // Create a reference to the new_panel as panel so that the existing
            // editors work with our isolate scope
            scope.panel = scope.new_panel;
            var template = '<div ng-include src="partial(\'panelgeneral\')"></div>';

            if(!(_.isUndefined(scope.type)) && scope.type !== "") {
              template = template+'<div ng-include src="\'app/panels/'+scope.type+'/editor.html\'"></div>';
            }
            elem.html($compile(angular.element(template))(scope));
          });
        });
      }
    };
  });

  module.filter('withoutColumn', function() {
    return function() {
      return _.without(config.panel_names,'column');
    };
  });
});