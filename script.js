// Переключение между играми
document.getElementById('platformer-btn').addEventListener('click', () => {
    document.getElementById('menu').classList.remove('active');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('platformer-game').classList.remove('hidden');
    document.getElementById('platformer-game').classList.add('active');
    startPlatformer();
});

document.getElementById('minesweeper-btn').addEventListener('click', () => {
    document.getElementById('menu').classList.remove('active');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('minesweeper-game').classList.remove('hidden');
    document.getElementById('minesweeper-game').classList.add('active');
    startMinesweeper();
});

document.getElementById('back-to-menu-platformer').addEventListener('click', () => {
    document.getElementById('platformer-game').classList.remove('active');
    document.getElementById('platformer-game').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('menu').classList.add('active');
});

document.getElementById('back-to-menu-minesweeper').addEventListener('click', () => {
    document.getElementById('minesweeper-game').classList.remove('active');
    document.getElementById('minesweeper-game').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('menu').classList.add('active');
});

// Платформер
function startPlatformer() {
    const canvas = document.getElementById('platformer-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;

    const player = {
        x: 50,
        y: 500,
        width: 40,
        height: 40,
        color: 'green',
        velocityY: 0,
        gravity: 0.5,
        jumpStrength: -10,
        isJumping: false
    };

    const platforms = [
        { x: 0, y: 550, width: 400, height: 20, color: 'brown' },
        { x: 100, y: 450, width: 100, height: 20, color: 'brown' },
        { x: 250, y: 350, width: 100, height: 20, color: 'brown' },
        { x: 50, y: 250, width: 100, height: 20, color: 'brown' }
    ];

    let score = 0;
    let gameOver = false;

    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawPlatforms() {
        platforms.forEach(platform => {
            ctx.fillStyle = platform.color;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
    }

    function updatePlayer() {
        player.velocityY += player.gravity;
        player.y += player.velocityY;

        // Проверка столкновений с платформами
        platforms.forEach(platform => {
            if (
                player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y + player.height > platform.y &&
                player.y < platform.y + platform.height &&
                player.velocityY > 0
            ) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            }
        });

        // Проверка на выход за пределы экрана
        if (player.y > canvas.height) {
            gameOver = true;
        }
    }

    function drawScore() {
        document.getElementById('score').textContent = score;
    }

    function gameLoop() {
        if (gameOver) {
            alert('Игра окончена! Ваш счет: ' + score);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawPlatforms();
        updatePlayer();
        drawScore();

        // Увеличиваем счет, если игрок поднимается
        if (player.velocityY < 0) {
            score += 1;
        }

        requestAnimationFrame(gameLoop);
    }

    // Управление
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !player.isJumping) {
            player.velocityY = player.jumpStrength;
            player.isJumping = true;
        }
    });

    canvas.addEventListener('touchstart', () => {
        if (!player.isJumping) {
            player.velocityY = player.jumpStrength;
            player.isJumping = true;
        }
    });

    gameLoop();
}

// Сапер (код из предыдущего примера)
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
