var angular = require("angular") //exposes angular even w/o storing it in a var
var _ = require("underscore")
var mf = require("./minefield")

angular.module('minesweeperApp', [])
.controller('minesweeperController', 
            ['$scope', function ($scope) {
		$scope.grid = mf.makeMinefield(15,15).plantMines(10)
		$scope.gridXRange = _.range($scope.grid.width)
		$scope.gridYRange = _.range($scope.grid.height)
		$scope.getCell = function(x,y) {
		    return "[" + $scope.grid.at(x,y) + "]"
		}
		$scope.uncover = $scope.grid.uncover
	    }])
