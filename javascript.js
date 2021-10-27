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
  const openResultModal = (winner) => {
    const modal = document.querySelector('.modal-result');
    const result = document.querySelector('.result');
    if (winner === 'tie') {
      result.textContent = 'The game was a tie!'
    } else if (winner === 'Computer') {
      result.textContent = `The Computer wins!`
    } else {
      if (playerOne.counter === winner) {
        result.textContent = `${playerOne.name} wins!`
      } else {
        result.textContent = `${playerTwo.name} wins!`
      }
    };
    const newGame = document.querySelector('.new-game');
    newGame.addEventListener('click', function() {
      location.reload();
    })
    modal.style.display = 'block';
  };
  const openPlayerModal = () => {
    const modal = document.querySelector('.modal-playerselect');
    modal.style.display = 'block';
    const playerSelect = document.querySelector('.player-select');
    playerSelect.remove();
    gameFlow.playerSelect();
  };
  
  return {
    generateGridCells, updateBoard, openResultModal, openPlayerModal,
  }
})();

const gameFlow = (function() {
  let gameType = '';

  const playerOrComputer = () => {
    const selectPlayer = document.querySelector('.player');
    selectPlayer.addEventListener('click', function() {
      displayController.openPlayerModal()
    });
    const selectComputer = document.querySelector('.computer');
    selectComputer.addEventListener('click', function() {
      const playerSelect = document.querySelector('.player-select');
      playerSelect.remove();
      const main = document.querySelector('.main');
      main.style.visibility = 'visible';
      gameType = 'Computer';
    });
  };

  const playerSelect = () => {
    const counterX = document.querySelector('#counterX');
    counterX.addEventListener('click', function() {
      let playerOneName = document.querySelector('#player-one');
      let playerTwoName = document.querySelector('#player-two');
      playerOne.name = playerOneName.value;
      playerOne.counter = 'X'
      playerTwo.name = playerTwoName.value;
      playerTwo.counter = 'O'
      playerOneName.value = '', playerTwoName.value = '' // clear form
      const modal = document.querySelector('.modal-playerselect');
      modal.style.display = 'none';
      const main = document.querySelector('.main');
      main.style.visibility = 'visible';
    });
    const counterO = document.querySelector('#counterO');
    counterO.addEventListener('click', function() {
      let playerOneName = document.querySelector('#player-one');
      let playerTwoName = document.querySelector('#player-two');
      playerOne.name = playerOneName.value;
      playerOne.counter = 'O'
      playerTwo.name = playerTwoName.value;
      playerTwo.counter = 'X'
      playerOneName.value = '', playerTwoName.value = '' // clear form
      const modal = document.querySelector('.modal-playerselect');
      modal.style.display = 'none';
      const main = document.querySelector('.main');
      main.style.visibility = 'visible';
    });
  };

  let counter = '';

  const firstTurn = () => {
    if (counter === '') { // first turn
      counter = playerOne.counter;
      return;
    };
  };

  const changeTurn = () => {
    if (counter === 'X') {
      counter = 'O';
    } else {
      counter = 'X'
    };
  };

  const randomCell = () => {
    // find empty elements in array
    let indexesBlank = [];
    for (i = 0; i <= 8; i++) {
      if (gameBoard.board[i] === '') {
        indexesBlank.push(i);
      };
    };
    // change random empty element with counter
    let indexRandom = Math.floor(Math.random()*indexesBlank.length);
    gameBoard.board[indexesBlank[indexRandom]] = counter;
    displayController.updateBoard();
    checkWin();
    changeTurn();
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
        firstTurn(); // first turn only
        gameBoard.board[index] = counter;
        displayController.updateBoard();
        checkWin();
        changeTurn();
        if (gameType === 'Computer') {
          randomCell();
        };
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
        displayController.openResultModal('X');
        return;
      } else if (winConditions[index].every(elem => indexesO.includes(elem))) {
        if (gameType === 'Computer') {
          displayController.openResultModal('Computer');
          console.log('Computer')
          return;
        } else {
          displayController.openResultModal('O');
          return;
        }
      };
    };
    if (gameBoard.board.includes('') === false) { // check for draw
      displayController.openResultModal('tie');
    }
  };
  return {
    cellClick, checkWin, playerOrComputer, playerSelect,
  }
})();

function createPlayer(name, counter, type) {
  return {
    name: name,
    counter: counter,
    type: type,
  };
};

const playerOne = createPlayer('Player One', 'X', 'Player');
const playerTwo = createPlayer('Player Two', 'O', 'Player');
const computer = createPlayer('Computer', 'O', 'Computer');

displayController.generateGridCells();
displayController.updateBoard();
gameFlow.cellClick();
gameFlow.playerOrComputer();