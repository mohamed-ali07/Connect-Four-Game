const ROWS = 6;
const COLS = 7;
const PLAYER1 = 1;
const PLAYER2 = 2;
const EMPTY = 0;
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const currentPlayerSpan = document.getElementById('current-player');
const resetButton = document.getElementById('resetButton');

let board = [];
let currentPlayer = PLAYER1;
let gameOver = false;
let winningCells = [];

function initializeGame() {
    board = Array(ROWS).fill(0).map(() => Array(COLS).fill(EMPTY));
    currentPlayer = PLAYER1;
    gameOver = false;
    winningCells = [];

    boardElement.innerHTML = '';
    boardElement.style.pointerEvents = 'auto';

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => handleCellClick(c));
            boardElement.appendChild(cell);
        }
    }
    updateStatusMessage();
    renderBoard();
}

function updateStatusMessage() {
    statusElement.classList.add('fade-out');
    setTimeout(() => {
        if (gameOver) {
            if (winningCells.length > 0) {
                // Corrected line: Display the actual currentPlayer as the winner
                statusElement.innerHTML = `<span class="player-turn ${currentPlayer === PLAYER1 ? 'player1-color' : 'player2-color'}">Player ${currentPlayer}</span> Wins!`;
            } else {
                statusElement.textContent = "It's a Tie!";
            }
            boardElement.style.pointerEvents = 'none';
        } else if (isBoardFull()) {
            statusElement.textContent = "It's a Tie!";
            boardElement.style.pointerEvents = 'none';
        } else {
            currentPlayerSpan.textContent = currentPlayer;
            currentPlayerSpan.classList.remove('player1-color', 'player2-color');
            currentPlayerSpan.classList.add(currentPlayer === PLAYER1 ? 'player1-color' : 'player2-color');
            statusElement.innerHTML = `Player <span id="current-player" class="player-turn ${currentPlayer === PLAYER1 ? 'player1-color' : 'player2-color'}">${currentPlayer}</span>'s Turn`;
        }
        statusElement.classList.remove('fade-out');
        statusElement.classList.add('fade-in');
    }, 300);
}

function handleCellClick(col) {
    if (gameOver) return;

    let rowToDrop = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === EMPTY) {
            rowToDrop = r;
            break;
        }
    }

    if (rowToDrop === -1) {
        console.log(`Column ${col} is full.`);
        return;
    }

    board[rowToDrop][col] = currentPlayer;
    renderBoard();

    const winInfo = checkWin(rowToDrop, col);
    if (winInfo.isWin) {
        gameOver = true;
        winningCells = winInfo.cells;
        highlightWinningPieces();
        updateStatusMessage();
        return;
    }

    if (isBoardFull()) {
        gameOver = true;
        updateStatusMessage();
        return;
    }

    currentPlayer = (currentPlayer === PLAYER1) ? PLAYER2 : PLAYER1;
    updateStatusMessage();
}

function renderBoard() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = boardElement.children[r * COLS + c];
            cell.classList.remove('player1', 'player2', 'winning-piece');
            if (board[r][c] === PLAYER1) {
                cell.classList.add('player1');
            } else if (board[r][c] === PLAYER2) {
                cell.classList.add('player2');
            }
        }
    }
}

function highlightWinningPieces() {
    winningCells.forEach(cellPos => {
        const cell = boardElement.children[cellPos.row * COLS + cellPos.col];
        if (cell) {
            cell.classList.add('winning-piece');
        }
    });
}

function isBoardFull() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === EMPTY) {
                return false;
            }
        }
    }
    return true;
}

function checkWin(row, col) {
    const player = board[row][col];
    let winCells = [];

    const checkLine = (r, c, dr, dc) => {
        let count = 0;
        let currentLineCells = [];
        for (let i = -3; i <= 3; i++) {
            const newR = r + i * dr;
            const newC = c + i * dc;

            if (newR >= 0 && newR < ROWS && newC >= 0 && newC < COLS && board[newR][newC] === player) {
                count++;
                currentLineCells.push({row: newR, col: newC});
                if (count >= 4) {
                    return { isWin: true, cells: currentLineCells.slice(currentLineCells.length - 4) };
                }
            } else {
                count = 0;
                currentLineCells = [];
            }
        }
        return { isWin: false, cells: [] };
    };

    let result = checkLine(row, col, 0, 1);
    if (result.isWin) return result;
    result = checkLine(row, col, 1, 0);
    if (result.isWin) return result;
    result = checkLine(row, col, 1, 1);
    if (result.isWin) return result;
    result = checkLine(row, col, 1, -1);
    if (result.isWin) return result;

    return { isWin: false, cells: [] };
}

resetButton.addEventListener('click', initializeGame);

window.onload = initializeGame;
