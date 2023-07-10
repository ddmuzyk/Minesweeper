import { createBoard, markTile, TILE_STATUSES, checkWin, checkLose, nearbyTiles} from "./minesweeper.js";
export const BOARD_SIZE = 10;
export const NUMBER_OF_MINES = 12;

const resetBtn = document.querySelector('.reset-btn');

const body = document.body;
let board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
let boardElement = document.querySelector('.board');
let minesLeftText = NUMBER_OF_MINES;
let messageText = document.querySelector('.subtext');

export let wasMineEncountered = false;
export let numOfCorrectTiles = 0;


const initializeGame = (board) => {
  board.forEach(row => {
    row.forEach(tile => {
      boardElement.appendChild(tile.element);
      tile.element.addEventListener('click', () => {
        revealTile(board, tile);
        checkGameEnd();
      })
      tile.element.addEventListener('contextmenu', e => {
        e.preventDefault();
        markTile(tile);
        listMinesLeft()
      })
    })
  })
  boardElement.style.setProperty('--size', BOARD_SIZE)
  minesLeftText = NUMBER_OF_MINES;
  messageText.textContent = `Mines left: ${minesLeftText}`;
}


function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
  }, 0)
  minesLeftText = NUMBER_OF_MINES - markedTilesCount;
  messageText.textContent = `Mines left: ${minesLeftText}`;
}

export function checkGameEnd() {
  let win = checkWin();
  let lose = checkLose();

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, {capture: true});
    boardElement.addEventListener('contextmenu', stopProp, {capture: true});
  }

  if (win) {
    messageText.textContent = 'You Win';
  }

  // 

  if (lose) {
    messageText.textContent = 'You Lose';
    board.forEach(row => {
      row.forEach(tile => {
        // console.log(tile)
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}

const resetGame = () => {
  boardElement.removeEventListener('click', stopProp, {capture: true})
  boardElement.removeEventListener('contextmenu', stopProp, {capture: true})
  body.removeChild(boardElement);
  body.removeChild(resetBtn);
  boardElement = document.createElement('div');
  boardElement.classList.add('board');
  wasMineEncountered = false;
  numOfCorrectTiles = 0;
  minesLeftText = NUMBER_OF_MINES;
  messageText.textContent = `Mines left: ${minesLeftText}`;
  body.append(boardElement, resetBtn);
  resetBtn.addEventListener('click', resetGame);
  board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
  initializeGame(board);
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    wasMineEncountered = true;
    return;
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(board,tile);
  const mines = adjacentTiles.filter(t => t.mine);
  if (mines.length === 0) {
    numOfCorrectTiles++;
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    numOfCorrectTiles++;
    tile.element.textContent = mines.length;
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}

// Event listeners ----------------

resetBtn.addEventListener('click', resetGame);

// Populate a board with tiles / mines
// Left click on tiles 
  // a. Reveal tiles
// Right click tiles
  // a.Mark tiles
// Check for win/lose

// Initialize game on load
initializeGame(board)