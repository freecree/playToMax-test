class Cell {
  constructor(value, row, col) {
    this.value = value;
    this.row = row;
    this.col = col;
    this._createHtmlElement();
  }

  _createHtmlElement() {
    const cellHtml = document.createElement('div');
    cellHtml.classList.add('board-cell');
    cellHtml.innerText = this.value;
    this.htmlElement = cellHtml;
  }

  getHtml() {
    return this.htmlElement;
  }

  clear() {
    this.value = '.';
    this.htmlElement.innerText = this.value;
  }
}

class Board {
  selectedValue;

  constructor(board) {
    this.board = board.map((row, i) => row.map((cell, j) => {
      return new Cell(cell, i, j);
    }));

    this.clearedMark = '.';
    this.connectedCellsQueue = [];
    this._createHtmlElement();
    this._initListeners();
  }

  _createHtmlElement() {
    const boardHtml = document.createElement('div');
    boardHtml.classList.add('board');
    this.htmlElement = boardHtml;

    this.board.forEach(row => {
      this.htmlElement.append(this._getRowHtml(row));
    });
  }

  _getRowHtml(row) {
    const rowHtml = document.createElement('div');
    rowHtml.classList.add('board-row');
    row.forEach(cell => {
      rowHtml.append(cell.getHtml());
    });
    return rowHtml;
  }

  _initListeners() {
    this.htmlElement.addEventListener('mousedown', e => {
      const target = e.target;
      const cell = this._getCellByHtmlElement(target);
      this.clearCells(cell);
    });
  }

  _getCellByHtmlElement(htmlElement) {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const cell = this._getCell(row, col);
        if (cell.getHtml() === htmlElement) {
          return cell;
        }
      }
    }
  }

  clearCells(checkedCell) {
    if (!checkedCell) return;

    this.selectedValue = checkedCell.value;
    this.connectedCellsQueue.push(checkedCell);

    while(this.connectedCellsQueue.length > 0) {
      const cell = this.connectedCellsQueue.shift();
      cell.clear();
      this.addConnectedCellsToQueue(cell);
    }
  }

  addConnectedCellsToQueue(cell) {
    this.ifCellIsValidAddToQueue(cell.row - 1, cell.col); // Up
    this.ifCellIsValidAddToQueue(cell.row + 1, cell.col); // Down
    this.ifCellIsValidAddToQueue(cell.row, cell.col - 1); // Left
    this.ifCellIsValidAddToQueue(cell.row, cell.col + 1); // Right
  }

  ifCellIsValidAddToQueue(row, col) {
    const cell = this._getCell(row, col);
    if (cell && cell.value === this.selectedValue) {
      this.connectedCellsQueue.push(cell);
    }
  }

  _getCell(row, col) {
    if (row >= 0 && col >= 0 && row < this.board.length && col < this.board.length) {
      return this.board[row][col];
    }
  }

  getHtml() {
    return this.htmlElement;
  }

}

class Game {
  constructor(board) {
    this.board = new Board(board);
    this.rootHtml = document.getElementById('root');
  }
  render() {
    this.rootHtml.append(this.board.getHtml());
  }
}

// Example usage:
const gameBoard = [
  [0, 0, 1, 2, 1, 1],
  [0, 0, 1, 2, 2, 2],
  [0, 1, 1, 2, 2, 2],
  [0, 1, 1, 1, 1, 2],
  [3, 1, 1, 1, 3, 3],
  [3, 3, 1, 1, 2, 1],
  [3, 3, 3, 0, 0, 1],
];

const game = new Game(gameBoard);
game.render();
