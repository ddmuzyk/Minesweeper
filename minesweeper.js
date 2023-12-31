// Logic
import { BOARD_SIZE, NUMBER_OF_MINES, wasMineEncountered, numOfCorrectTiles } from "./script.js";

export const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked',
}



export function createBoard(boardSize, numberOfMines){
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines)
  // console.log(minePositions)
  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement('div');
      element.classList.add('tile')
      element.dataset.status = TILE_STATUSES.HIDDEN;
      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, {x, y})),
        get status() {
          return element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      }
      row.push(tile);
    }
    board.push(row);
  }

  return board;
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN && 
    tile.status !== TILE_STATUSES.MARKED
  ) {
      return 
    }

    if (tile.status === TILE_STATUSES.MARKED) {
      tile.status = TILE_STATUSES.HIDDEN;
    } else {
      tile.status = TILE_STATUSES.MARKED;
    }
}

function getMinePositions(boardSize,numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    }

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position)
    }
  }

  return positions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}



export function nearbyTiles(board, {x, y}) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x+xOffset]?.[y+yOffset];
      if (tile) tiles.push(tile)
    }
  } 

  return tiles;
}

export function checkLose(board) {
  return wasMineEncountered;
}

export function checkWin(board) {
  return BOARD_SIZE*BOARD_SIZE - NUMBER_OF_MINES === numOfCorrectTiles;
}

