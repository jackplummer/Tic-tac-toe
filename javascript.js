const gameBoard = {
  board : ['', '', '', '', '', '', '', '', ''],
};

const displayController = (function () {
  const displayBoard = document.querySelector('.game-board');
  const generateGridCells = () => {
    while (displayBoard.firstChild) { // removes all cells from grid
      displayBoard.removeChild(displayBoard.lastChild);
    };
    for (let i = 0; i <= 8; i++) { // generate grid cells
      let newCell = document.createElement('div');
      newCell.classList.add(`cell`);
      newCell.setAttribute('data-index', `${i}`);
      displayBoard.appendChild(newCell);
    };
  };
  const updateBoard = () => {
    const gridCells = document.querySelectorAll('.game-board > div');
    for (let i = 0; i <= 8; i++) {
      gridCells[i].textContent = gameBoard.board[i];
    };
  };
  const openModal = (winner) => {
    const modal = document.querySelector(".modal");
    const result = document.querySelector('.result');
    if (winner === 'tie') {
      result.textContent = 'The game was a tie!'
    } else {
      result.textContent = `${winner} wins!`
    };
    const newGame = document.querySelector('.new-game');
    newGame.addEventListener('click', function() {
      location.reload();
    })
    modal.style.display = 'block';
  };
  
  return {
    generateGridCells, updateBoard, openModal,
  }
})();

const gameFlow = (function() {
  let counter = 'X';
  const changeTurn = () => {
    if (counter === 'X') {
      counter = 'O';
    } else {
      counter = 'X'
    };
  };
  const cellClick = () => {
    const gridCells = document.querySelectorAll('.game-board > div');
    for (const cell of gridCells) {
      cell.addEventListener('click', function() {
        let index = cell.dataset.index;
        if (gameBoard.board[index] === 'X' || // check if empty
          gameBoard.board[index] === 'O') {
            return;
          };
        gameBoard.board[index] = counter;
        displayController.updateBoard();
        changeTurn();
        checkWin();
      });
    };
  };
  const winConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  const checkWin = () => {
    let indexesX = [];
    let indexesO = [];
    for (i = 0; i <= 8; i++) {
      if (gameBoard.board[i] === 'X') {
        indexesX.push(i);
      } else if (gameBoard.board[i] === 'O') {
        indexesO.push(i);
      };
    };
    for (const index in winConditions) {
      if (winConditions[index].every(elem => indexesX.includes(elem))) {
        displayController.openModal('X');
        return;
      } else if (winConditions[index].every(elem => indexesO.includes(elem))) {
        displayController.openModal('O');
        return;
      };
    };
    if (gameBoard.board.includes('') === false) { // check for draw
      displayController.openModal('tie');
    }
  };
  return {
    cellClick, checkWin,
  }
})();



displayController.generateGridCells()
displayController.updateBoard()
gameFlow.cellClick();