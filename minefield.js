//Methods starting with _ are not to be exposed. Also not to be cofused with the underscore library
var _ = require("underscore")
var arr2d = require("./array2d")
var geom = require("./geometry")
var cell = require("./cell")

var defaultWidth = 10
var defaultHeight = 10
var defaultNumMines = 10

function _initMinefield(w, h) {
  //make a WxH array initialized to 0
  var mf = arr2d.make2dArray(w,h).setAll(cell.makeCell, true)
  //add a property to track how many flags a user has placed
  mf.flagCount = 0 
  return mf
}

function _validNeighbours(minefield,x,y) {
  //returns the 8 points adjacent to x,y given that they're in bounds
  return _.filter(geom.adjacent(geom.pt(x,y)), function(point) {
    return minefield.inBounds(point.x, point.y)
  })
}

function plantMine(minefield, x, y) {
  //mark the mine
  if(minefield.inBounds(x,y)) {
    minefield.get(x,y).plantMine()
  }
  //increment the # on the 8 adjacent positions if not a mine
  _.map(_validNeighbours(minefield,x,y), function (point) {
    minefield.get(point.x,point.y).dangerUp()
  })
  return minefield
}

function plantFlag(minefield, x, y) {
  //if in bounds, change the state to say a flag is there
  if(minefield.inBounds(x,y)) {
    var cell = minefield.get(x,y).plantFlag() //returns this, so the cell is still stored
    //update the flag count. The flag jsut toggled on/off so the change is +1/-1
    if(cell.hasFlag) {
      minefield.flagCount = minefield.flagCount + 1
    } else {
      minefield.flagCount = minefield.flagCount - 1
    }
  }
  return minefield
}

function _maxPt(minefield) {
    //return a point representing the dimentions
    return geom.pt(minefield.shape[0],minefield.shape[1])
}

function getPropagationList(minefield, x, y) {
    //return the list of points which also get
    //  uncovered when pressing (x,y)
    //graph search, 2 lists - todo & done
    //  keep pulling new neighbours (8 dirs) of nodes
    //  in the toCheck list iff that node's value is 0
    var toCheck = [geom.pt(x,y)]
    var checked = []
    while(toCheck.length !== 0) {
      //mark the coordinate as checked, get a reference to the node
      var coor = toCheck.pop()
      checked.push(coor)
      var node = minefield.get(coor.x,coor.y)
      //if its value is 0, store new neighours in 'toCheck'
      if(node.dangerLevel === 0) { //do not use getValue() here (that returns ' ')
        var allNeighbours = _validNeighbours(minefield,coor.x,coor.y)
        var newNeighbours = geom.difference(allNeighbours, checked)
        toCheck = toCheck.concat(newNeighbours)
      } //else do nothing
    }
    return checked
}

function plantMines(minefield, n) {
  //get n random valid points
  var pts = _.sample(geom.getAllCoordinates(_maxPt(minefield)), _limitVal(n,0,50*50,defaultNumMines))
  //place a mine at each of those points
  _.map(pts, function(point) {
      minefield.plantMine(point.x, point.y)
  })
  return minefield
}

function showAll(minefield) {
  //Used to show all cells (w/o propagation); Used for testing
  var allPts = geom.getAllCoordinates(_maxPt(minefield))
  _.map(allPts, function(point) {
    minefield.get(point.x, point.y).show()
  })
  return minefield
}

function _showAllMines(minefield) {
  //Used to show all mines (w/o propagation); Used when a player loses
  var allPts = geom.getAllCoordinates(_maxPt(minefield))
  _.map(allPts, function(point) {
    var cell = minefield.get(point.x, point.y)
    if(cell.isMine) {
      cell.show()
    }
  })
  return minefield
}

function at(minefield, x, y) {
  //return the cell value at (x,y)
  //  possible results: ' ', 'm', 0-8
  return minefield.get(x,y).getValue()
}

function isHidden(minefield, x, y) {
  //exposes the bool to the outside
  return minefield.get(x,y).isHidden
}

function uncover(minefield, x, y) {
  //returns a bool 'isGameOver'
  var cell = minefield.get(x,y)
  if(cell.isMine) { //game over
    //show all mines
    _showAllMines(minefield)
    return true
  } else {
    //show the cell itself
    cell.show()
    //propagate uncovering to show other stuff
    _.map(getPropagationList(minefield,x,y), function(point) {
      minefield.get(point.x, point.y).show()
    })
  }
  return false
}

function _limitVal(val, min, max, defaultForVal) {
  var v = val || defaultForVal
  if(v < min) { return min }
  else if (v > max) { return max }
  return v
}

function makeMinefield(width,height) {
  //methods are added in this manner to
  //  keep this factory from becoming huge
  //  and to aid testing by having the functions
  //  independent of the object
  var mf = _initMinefield(_limitVal(width,1,50,defaultWidth),
                          _limitVal(height,1,50,defaultHeight))
  mf.plantMine = _.partial(plantMine, mf)
  mf.plantMines = _.partial(plantMines, mf)
  mf.plantFlag = _.partial(plantFlag, mf)
  mf.width = mf.shape[0]
  mf.height = mf.shape[1]
  mf.at = _.partial(at, mf)
  mf.uncover = _.partial(uncover, mf)
  mf.isHidden = _.partial(isHidden, mf)
  mf.showAll = _.partial(showAll, mf)
  //below are functions that aren't part of the interface, but really needed to be tested
  mf.getPropagationList = _.partial(getPropagationList, mf)
  return mf
}

module.exports.makeMinefield = makeMinefield
