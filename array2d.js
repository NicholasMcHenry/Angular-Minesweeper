//Enhances ndarry with some 2darray specific functions
//Meant to be used with a chaining syntax

//Explicitly passing arr2d instead of using 'this' for
//  clarity purposes

//Naming convention:
// 2dArray when possible otherwise arr2d
// This means variables will always be 'arr2d'
// as number can't comes first. However
// when there is a prefix 'prefix2dArray' works
// just fine as a var name.

var ndarray = require("ndarray")
var _ = require("underscore")

function setAll(arr2d, val, valIsAFunction) {
  //set all elements to val & return the array
  // 3rd param is optional, does val() for every cell and stores the result
  for(i=0;i<arr2d.shape[0];i++) {
    for(j=0;j<arr2d.shape[1];j++) {
      if(valIsAFunction) {
        arr2d.set(i,j, val())
      } else {
        arr2d.set(i,j, val)
      }
    }
  }
  return arr2d
}

function flatten(arr2d) {
  //return a normal 1d version of the 2d array; (0,0) (1,0) ordering
  var arr = []
  for(j=0;j<arr2d.shape[1];j++) {
    for(i=0;i<arr2d.shape[0];i++) {
      arr.push(arr2d.get(i,j))
    }
  }
  return arr
}

function toString(arr2d) {
  //Turns a 2d array into a string with newlines for easy testing
  // assumes values can be added to a string
  return _.reduce(flatten(arr2d),
		  function(a,b) {return a+b}, //append-to-string
		  "")
}

function inBounds(arr2d, x, y) {
    //Returns a boolean indicating whether that coordinate is a valid array index
    return x < arr2d.shape[0]
	&& y < arr2d.shape[1]
	&& x >= 0
	&& y >= 0
}

function safeSet(arr2d, x, y, val) {
    if(inBounds(arr2d,x,y)) {
	arr2d.set(x,y,val)
    }
    return arr2d
}

function make2dArray(width, height) {
  //Make a new 2d array with dimensions width & height
  // & add memberfunctions
  var obj = ndarray(new Array(width*height), [width,height])
  obj.setAll = _.partial(setAll, obj)
  obj.flatten = _.partial(flatten, obj)
  obj.toString = _.partial(toString, obj)
  obj.inBounds = _.partial(inBounds, obj)
  obj.safeSet = _.partial(safeSet, obj)
  return obj
}

module.exports = {
  make2dArray: make2dArray
}
