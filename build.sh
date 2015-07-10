#!/bin/bash
browserify minesweeperApp.js -o minesweeper-bundle.js && jade index.jade && open -a Firefox index.html
