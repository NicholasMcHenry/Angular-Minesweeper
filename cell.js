//A Minesweeper Cell. Stores the possible states
//  One of: isMine, isHidden, or dangerLvl(0-8)
var cellPrototype = {
  dangerLevel:0, //indicates number of adjacent mines
  isMine:false,
  isHidden:true,
  hasFlag:false,
  getValue: function() {
    if(this.hasFlag) {
      return 'f'
    } else if(this.isHidden) {
      return ' '
    } else if (this.isMine) {
      return 'm'
    } else {
      return this.dangerLevel
    }
  },
  dangerUp: function() {
    //increment the # indicating the number of adjacent mines
    if(!this.isMine) {
      this.dangerLevel = this.dangerLevel + 1
    }
    return this
  },
  plantMine: function() {
    //change the cell state to indicate a mine is here
    this.isMine = true
    this.dangerLevel = 'm'
    return this
  },
  plantFlag: function() {
    //toggles the state for the flag icon on & off iff hidden
    if(this.isHidden) {
      this.hasFlag = !this.hasFlag
    }
    return this
  },
  toString: function() {
    return this.getValue()
  },
  show: function() {
    //change the state so that things can be seen
    //  this means getValue() will now return #s when called
    this.hasFlag = false
    this.isHidden = false
    return this.getValue()
  }
}

function makeCell() {
    return Object.create(cellPrototype)
}

module.exports.makeCell = makeCell
