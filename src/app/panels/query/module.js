/*

  ## query

  ### Parameters
  * query ::  A string or an array of querys. String if multi is off, array if it is on
              This should be fixed, it should always be an array even if its only
              one element
*/
define([
  'angular',
  'app',
  'underscore',
  'css!./query.css'
], function (angular, app, _) {
  'use strict';

  var module = angular.module('kibana.panels.query', []);
  app.useModule(module);

  module.controller('query', function($scope, querySrv, $rootScope) {
    $scope.panelMeta = {
      modals: [{
        description: "Inspect",
        icon: "icon-info-sign",
        partial: "app/partials/inspector.html",
        show: true
      }],
      status  : "Stable",
      description : "Provide a search bar for free-form queries. You almost certainly want one of these somewhere prominent on your dashboard."
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
      query   : "*:*",
      pinned  : true,
      history : [],
      spyable : true,
      remember: 10, // max: 100, angular strap can't take a variable for items param
      operator: 'OR'
    };
    _.defaults($scope.panel,_d);

    $scope.querySrv = querySrv;

    $scope.init = function() {
      querySrv.operator = $scope.panel.operator;
    };

    $scope.reset = function() {
      $scope.querySrv.list[Object.keys($scope.querySrv.list).length - 1].query = _d.query;
      $rootScope.$broadcast('refresh');
    };

    $scope.refresh = function() {
      update_history(_.pluck($scope.querySrv.list,'query'));
      querySrv.operator = $scope.panel.operator;
      $rootScope.$broadcast('refresh');
    };

    $scope.render = function() {
      $rootScope.$broadcast('render');
    };

    $scope.toggle_pin = function(id) {
      querySrv.list[id].pin = querySrv.list[id].pin ? false : true;
    };

    $scope.close_edit = function() {
      $scope.refresh();
    };

    var update_history = function(query) {
      if($scope.panel.remember > 0) {
        $scope.panel.history = _.union(query.reverse(),$scope.panel.history);
        var _length = $scope.panel.history.length;
        if(_length > $scope.panel.remember) {
          $scope.panel.history = $scope.panel.history.slice(0,$scope.panel.remember);
        }
      }
    };

    $scope.init();
  });
});
