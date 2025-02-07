const BOARD_SIZE = 5;
const MINES_COUNT = 5;
let board = [];
let revealed = [];

// Инициализация поля
function createBoard() {
    board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    revealed = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));

    // Расставляем мины
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
        const x = Math.floor(Math.random() * BOARD_SIZE);
        const y = Math.floor(Math.random() * BOARD_SIZE);

        if (board[x][y] !== -1) {
            board[x][y] = -1;
            minesPlaced++;

            // Обновляем счетчики вокруг мины
            for (let i = Math.max(0, x - 1); i <= Math.min(BOARD_SIZE - 1, x + 1); i++) {
                for (let j = Math.max(0, y - 1); j <= Math.min(BOARD_SIZE - 1, y + 1); j++) {
                    if (board[i][j] !== -1) {
                        board[i][j]++;
                    }
                }
            }
        }
    }
}

// Отрисовка поля
function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = i;
            cell.dataset.y = j;

            if (revealed[i][j]) {
                cell.classList.add('revealed');
                if (board[i][j] === -1) {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else {
                    cell.textContent = board[i][j] || '';
                }
            }

            cell.addEventListener('click', () => revealCell(i, j));
            boardElement.appendChild(cell);
        }
    }
}

// Открытие клетки
function revealCell(x, y) {
    if (revealed[x][y]) return;

    revealed[x][y] = true;

    if (board[x][y] === -1) {
        alert('Вы наткнулись на мину! Игра окончена.');
        revealAllCells();
    }

    renderBoard();
}

// Открыть все клетки (в конце игры)
function revealAllCells() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            revealed[i][j] = true;
        }
    }
    renderBoard();
}

// Кнопка "Начать заново"
document.getElementById('restart').addEventListener('click', () => {
    createBoard();
    renderBoard();
});

// Инициализация игры
createBoard();
renderBoard();