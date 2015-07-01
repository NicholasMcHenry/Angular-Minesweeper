var angular = require("angular") //exposes angular even w/o storing it in a var
var _ = require("underscore")
var mf = require("./minefield")

angular.module('minesweeperApp', [])
.controller('minesweeperController', 
            ['$scope', minesweeperController])
function minesweeperController($scope) {
  //Configuration layer for the minefield node module
  //  Just pulls already defined functions into angular
  //  Also adds some graphics related functionality

  //settings
  $scope.gridWidth = 10
  $scope.gridHeight = 10
  $scope.numMines = 10

  //Functionality
  $scope.setSmileyGraphic = function(gfxId) {
    if(gfxId === "GAME_OVER") {
      $scope.smileyGraphic = "=X GAME OVER"
    } else {
      $scope.smileyGraphic = "=) RESET"
    }
  }
  //initialization func; grid is the main data structure
  $scope.reset = function() {
    $scope.grid = mf.makeMinefield($scope.gridWidth,$scope.gridHeight).plantMines($scope.numMines)
    $scope.uncover = function(x,y) {
      var isGameOver = $scope.grid.uncover(x,y)
      if(isGameOver) {
        $scope.setSmileyGraphic("GAME_OVER")
      }
    }
    $scope.gridXRange = _.range($scope.gridWidth)
    $scope.gridYRange = _.range($scope.gridHeight)
    $scope.getCell = function(x,y) {
      return "[" + $scope.grid.at(x,y) + "]"
    }
    $scope.setSmileyGraphic("DEFAULT")
  }
  $scope.reset()
}
