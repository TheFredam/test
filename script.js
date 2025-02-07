// Переключение между играми
document.getElementById('snake-btn').addEventListener('click', () => {
    document.getElementById('menu').classList.remove('active');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('snake-game').classList.remove('hidden');
    document.getElementById('snake-game').classList.add('active');
    startSnake();
});

document.getElementById('minesweeper-btn').addEventListener('click', () => {
    document.getElementById('menu').classList.remove('active');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('minesweeper-game').classList.remove('hidden');
    document.getElementById('minesweeper-game').classList.add('active');
    startMinesweeper();
});

document.getElementById('back-to-menu-snake').addEventListener('click', () => {
    document.getElementById('snake-game').classList.remove('active');
    document.getElementById('snake-game').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('menu').classList.add('active');
});

document.getElementById('back-to-menu-minesweeper').addEventListener('click', () => {
    document.getElementById('minesweeper-game').classList.remove('active');
    document.getElementById('minesweeper-game').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('menu').classList.add('active');
});

// Змейка
// Змейка
function startSnake() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;

    let snake = [{ x: 10, y: 10 }]; // Начальная позиция змейки
    let food = { x: 5, y: 5 }; // Начальная позиция еды
    let direction = { x: 0, y: 0 }; // Направление движения
    let gameOver = false;

    // Основной игровой цикл
    function gameLoop() {
        if (gameOver) {
            alert('Игра окончена!');
            return;
        }

        update(); // Обновление состояния игры
        draw();   // Отрисовка игры
        setTimeout(gameLoop, 100); // Запуск следующего кадра
    }

    // Обновление состояния игры
    function update() {
        // Новая голова змейки
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Проверка на столкновение с границами
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver = true;
            return;
        }

        // Проверка на столкновение с собой
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver = true;
            return;
        }

        // Добавляем новую голову
        snake.unshift(head);

        // Проверка на съедание еды
        if (head.x === food.x && head.y === food.y) {
            // Генерируем новую еду
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } else {
            // Удаляем хвост, если еда не съедена
            snake.pop();
        }
    }

    // Отрисовка игры
    function draw() {
        // Очистка холста
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Рисуем змейку
        ctx.fillStyle = 'lime';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });

        // Рисуем еду
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction.y === 0) direction = { x: 0, y: -1 }; // Вверх
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = { x: 0, y: 1 }; // Вниз
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = { x: -1, y: 0 }; // Влево
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = { x: 1, y: 0 }; // Вправо
                break;
        }
    });

    // Управление свайпами
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Горизонтальный свайп
            if (dx > 0 && direction.x === 0) direction = { x: 1, y: 0 }; // Вправо
            else if (dx < 0 && direction.x === 0) direction = { x: -1, y: 0 }; // Влево
        } else {
            // Вертикальный свайп
            if (dy > 0 && direction.y === 0) direction = { x: 0, y: 1 }; // Вниз
            else if (dy < 0 && direction.y === 0) direction = { x: 0, y: -1 }; // Вверх
        }
    });

    // Запуск игры
    gameLoop();
}

// Сапер
function startMinesweeper() {
    const BOARD_SIZE = 10;
    const MINES_COUNT = 15;
    let board = [];
    let revealed = [];
    let flagged = [];
    let gameOver = false;

    function createBoard() {
        board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
        revealed = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
        flagged = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
        gameOver = false;

        let minesPlaced = 0;
        while (minesPlaced < MINES_COUNT) {
            const x = Math.floor(Math.random() * BOARD_SIZE);
            const y = Math.floor(Math.random() * BOARD_SIZE);

            if (board[x][y] !== -1) {
                board[x][y] = -1;
                minesPlaced++;

                for (let i = Math.max(0, x - 1); i <= Math.min(BOARD_SIZE - 1, x + 2); i++) {
                    for (let j = Math.max(0, y - 1); j <= Math.min(BOARD_SIZE - 1, y + 2); j++) {
                        if (board[i][j] !== -1) {
                            board[i][j]++;
                        }
                    }
                }
            }
        }
    }

    function renderBoard() {
        const boardElement = document.getElementById('minesweeper-board');
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
                } else if (flagged[i][j]) {
                    cell.classList.add('flagged');
                    cell.textContent = '🚩';
                }

                cell.addEventListener('click', () => revealCell(i, j));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    toggleFlag(i, j);
                });

                boardElement.appendChild(cell);
            }
        }
    }

    function revealCell(x, y) {
        if (gameOver || revealed[x][y] || flagged[x][y]) return;

        revealed[x][y] = true;

        if (board[x][y] === -1) {
            gameOver = true;
            alert('Вы проиграли!');
            revealAllCells();
        } else if (board[x][y] === 0) {
            for (let i = Math.max(0, x - 1); i <= Math.min(BOARD_SIZE - 1, x + 1); i++) {
                for (let j = Math.max(0, y - 1); j <= Math.min(BOARD_SIZE - 1, y + 1); j++) {
                    if (!revealed[i][j]) {
                        revealCell(i, j);
                    }
                }
            }
        }

        checkWin();
        renderBoard();
    }

    function toggleFlag(x, y) {
        if (gameOver || revealed[x][y]) return;

        flagged[x][y] = !flagged[x][y];
        renderBoard();
    }

    function revealAllCells() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                revealed[i][j] = true;
            }
        }
        renderBoard();
    }

    function checkWin() {
        let unrevealedSafeCells = 0;
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] !== -1 && !revealed[i][j]) {
                    unrevealedSafeCells++;
                }
            }
        }

        if (unrevealedSafeCells === 0) {
            gameOver = true;
            alert('Вы выиграли!');
        }
    }

    createBoard();
    renderBoard();
}
