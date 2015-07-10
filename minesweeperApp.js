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
  $scope.numberTiles = ["green.jpg","green1.jpg","green2.jpg","green3.jpg", "green4.jpg", "green5.jpg", "green6.jpg", "green7.jpg", "green8.jpg"]
  $scope.resolveImage = function(val) {
    //get the image for that value
    //  covered tiles get a random grass image
    //behavior undefined for strange cell values
    var imgName = ""
    if(val === 'm') { imgName = "explosion.jpg" }
    else if(val === ' ') { imgName = "grass3.jpg" }
    else { //is a number tile
      imgName = $scope.numberTiles[val]
    }
    return imgName
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
    $scope.isRevealed = function(x,y) {
      return !$scope.grid.isHidden(x,y)
    }
    $scope.gridXRange = _.range($scope.gridWidth)
    $scope.gridYRange = _.range($scope.gridHeight)
    $scope.getCell = function(x,y) {
      //read the value at that cell and return the right graphic (as a filename)
      var val = $scope.grid.at(x,y)
      return $scope.resolveImage(val)
    }
    $scope.setSmileyGraphic("DEFAULT")
  }
  $scope.reset()
}
