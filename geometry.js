var _ = require("underscore")

function pt(a,b) {
  //create a point at with coordinates (a,b)
  return {x:a,y:b}
}

function add(p1, p2) {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y
  }
}

function subtract(p1, p2) {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  }
}

function directions() {
  //return a list of vectors for
  //  the 8 cardinal directions
  return [pt(-1,-1),
         pt(0,-1),
         pt(1,-1),
         pt(-1,0),
         pt(1,0),
         pt(-1,1),
         pt(0,1),
         pt(1,1)]
}

function adjacent(p) {
  //returns an array of the 7 points
  //adjacent to point p
  return _.map(directions(), function(dir) {
    return add(dir, p)
  })
}

function getAllCoordinates(endPoint) {
    //return the set { (x,y) | x in [0,e.x), y in [0,e.y) }
    //  aka all integer coordinates in the square
    //O(n^2) but doesn't matter the #s are tiny     
    var ls = []
    for(j=0;j<endPoint.y;j++) {
      for(i=0;i<endPoint.x;i++) {
	  ls.push(pt(i,j))
      }
    }
    return ls
}

function equal(p1, p2) {
  //defines point equality
  return p1.x === p2.x && p1.y === p2.y
}

function isMember(ls, point) {
  //checks if the list ls contains the point pt
  var rslt = _.filter(ls, _.partial(equal, point))
  return rslt.length >= 1
}

function difference(ls1, ls2) {
  //underscore's difference function made to work with point objects
  return _.filter(ls1, function(p) {
    return !isMember(ls2, p)
  })
}

function sort(ls) {
  //sort made to work with points
  //sort by y, then (stable) sort by x
  _.chain(ls)
   .sortBy(ls, function(p) {return p.y})
   .sortBy(ls, function(p) {return p.x})
   .value()
}

module.exports.pt = pt
module.exports.adjacent = adjacent
module.exports.difference = difference
module.exports.equal = equal
module.exports.getAllCoordinates = getAllCoordinates
module.exports.isMember = isMember
module.exports.sort = sort
