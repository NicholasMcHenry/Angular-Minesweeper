var expect = require("chai").expect
var a2d = require("../array2d.js")
var geom = require("../geometry")
var mf = require("../minefield")
 
describe('array2d', function() {
  describe('#make2dArray', function() {
    it("should have the correct dimensions", function() {
      var baseCase = a2d.make2dArray(0,0).shape
      expect(baseCase).to.be.deep.equal([0,0])

      var testCase = a2d.make2dArray(2,3).shape
      expect(testCase).to.be.deep.equal([2,3])
    })
  })
  describe('#setAll', function() {
    it("should change all elements to some value", function() {
      var testCase = a2d.make2dArray(2,3).setAll(0)
      expect(testCase.get(0,0)).to.be.equal(0)
      expect(testCase.get(0,1)).to.be.equal(0)
      expect(testCase.get(0,2)).to.be.equal(0)
      expect(testCase.get(1,0)).to.be.equal(0)
      expect(testCase.get(1,1)).to.be.equal(0)
      expect(testCase.get(1,2)).to.be.equal(0)
    })
  })
  describe('#flatten', function() {
    it("should return the same values in a 1d array", function() {
      var baseCase = a2d.make2dArray(0,0).flatten()
      expect(baseCase).to.be.deep.equal([])

      var testCase = a2d.make2dArray(2,3)
      testCase.set(0,0,1)
      testCase.set(1,2,'s')
      expect(testCase.flatten()).to.be.deep.equal([1,undefined,undefined,undefined,undefined,'s'])
    })
  })
  describe('#toString', function() {
    it("should take the contents and put them in a string iterating x before y", function() {
      var baseCase = a2d.make2dArray(0,0).toString()
      expect(baseCase).to.be.equal("")

      var testArray = a2d.make2dArray(2,3).setAll(0)
      testArray.set(1,0,"s")
      testArray.set(0,1,"srf")
      testArray.set(1,1,55)
      var testCase = testArray.toString()
      //The abnormal indentation below is to be kept, it mirrors the 2d grid structure but looks messed up because some sells contain multiple characters
      expect(testCase).to.be.equal("\
0s\
srf55\
00")
    })
  })
})

describe('geometry', function() {
  describe('#isMember', function() {
    it("should return true when the point is in the list", function() {
      var testCase = geom.isMember([geom.pt(4,5),geom.pt(0,5)], geom.pt(0,5))
      expect(testCase).to.be.true
    })
    it("should return false when the point is not in the list", function() {
      var baseCase = geom.isMember([], geom.pt(0,5))
      expect(baseCase).to.be.false
    })
  })
  describe('#difference', function() {
    it("should remove points in the second list from the first", function() {
      var baseCase = geom.difference([], [])
      expect(baseCase).to.be.deep.equal([])

      var testCase = geom.difference([geom.pt(0,0),geom.pt(0,1)],
                                     [geom.pt(0,0)])
      expect(testCase).to.be.deep.equal([geom.pt(0,1)])
    })
  })
  describe('#adjacent', function() {
    it("should have length 8", function() {
      var rslt = geom.adjacent(geom.pt(3,3))
      expect(rslt).to.have.property("length",8)
    })
    it("should return the adjacent 8 compass directions in order incrementing x before y", function() {
      var rslt = geom.adjacent(geom.pt(3,3))
      expect(rslt).to.be.deep.equal([geom.pt(2,2),
                                     geom.pt(3,2),
                                     geom.pt(4,2),
                                     geom.pt(2,3),
                                     geom.pt(4,3),
                                     geom.pt(2,4),
                                     geom.pt(3,4),
                                     geom.pt(4,4)])
    })
  })
})

describe('minefield', function() {
  describe('#plantMine', function() {
    it("should plant a mine at x,y & update neighboring positions", function() {
      var testCase = mf.makeMinefield(5,5).plantMine(2,2).showAll().toString()
      expect(testCase).to.be.equal("\
00000\
01110\
01m10\
01110\
00000")
    })
    it("should work in corners", function() {
      var testCase = mf.makeMinefield(1,1).plantMine(0,0).showAll().toString()
      expect(testCase).to.be.equal("m")
    })
    it("should increment correctly when mines are adjacent", function() {
      var testCase = mf.makeMinefield(5,5)
      	               .plantMine(2,2)
      	               .plantMine(3,2)
                       .showAll()
      	               .toString()
      expect(testCase).to.be.equal("\
00000\
01221\
01mm1\
01221\
00000")
    })
  })
  describe('#getPropagationList', function() {
    it("should return all adjacent (8 dir) 0 cells and any cells adjacent to those.", function() {
      var testCase = mf.makeMinefield(5,5)
      	               .plantMine(1,0)
      	               .plantMine(0,3)
      	               .plantMine(2,4)
      	               .plantMine(4,3)
                       .getPropagationList(4,0)
//Left: what is there; Right: stars are uncovered spots
//1m100 __***
//11100 _****
//11011 _****
//m212m _***_
//12m21 _____
      var expected = [geom.pt(2,0), geom.pt(3,0), geom.pt(4,0),
                      geom.pt(1,1), geom.pt(2,1), geom.pt(3,1), geom.pt(4,1),
                      geom.pt(1,2), geom.pt(2,2), geom.pt(3,2), geom.pt(4,2),
                      geom.pt(1,3), geom.pt(2,3), geom.pt(3,3)]
      //check that both lists contain the same point
      expect(geom.sort(testCase)).to.be.deep.equal(geom.sort(expected))
    })
    it("should return only 1 element when a non-0 cell is pressed", function() {
      var minefield = mf.makeMinefield(5,5)
      	                .plantMine(0,0)
      //clicking next to a mine
      var testCase = minefield.getPropagationList(0,1)
      var expected = [geom.pt(0,1)]
      expect(testCase).to.be.deep.equal(expected)

      //clicking the mine itself
      var testCase2 = minefield.getPropagationList(0,0)
      var expected2 = [geom.pt(0,0)]
      expect(testCase2).to.be.deep.equal(expected2)
    })
  })
})
