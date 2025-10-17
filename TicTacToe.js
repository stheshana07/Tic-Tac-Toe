const X_CLASS = 'x';
const O_CLASS = 'o';
const BOT_NAME = "stheshBot 🤖"; // Name for the bot
let playerXName = ""; // Name for X (always the human in PVB mode)
let playerOName = ""; // Name for O (human or bot)
let isBotMode = false;

const gameSetupElement = document.getElementById('game-setup');
const modeSelectionElement = document.getElementById('mode-selection');
const playerVsPlayerElement = document.getElementById('player-vs-player');
const playerVsBotElement = document.getElementById('player-vs-bot');

const modeHumanBtn = document.getElementById('mode-human');
const modeBotBtn = document.getElementById('mode-bot');
const startPVPBtn = document.getElementById('start-pvp');
const startPVBBtn = document.getElementById('start-pvb');

let gameElement = document.getElementById('game');
let banner = document.getElementById('banner');
let bannertxt = "";
let charIndex = 0;

// The rest of the game elements
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.getElementById('winningMessageText');
const restartButton = document.getElementById('restartButton');
let oTurn;

modeHumanBtn.addEventListener('click', () => {
    modeSelectionElement.style.display = 'none';
    playerVsPlayerElement.style.display = 'block';
});

modeBotBtn.addEventListener('click', () => {
    modeSelectionElement.style.display = 'none';
    playerVsBotElement.style.display = 'block';
});

// 2. Start Game Buttons
startPVPBtn.onclick = () => {
    const p1Input = document.getElementById('player1-name').value.trim();
    const p2Input = document.getElementById('player2-name').value.trim();

    if (p1Input && p2Input) {
        playerXName = p1Input;
        playerOName = p2Input;
        isBotMode = false;
        gameSetupElement.style.display = 'none';
        gameElement.style.display = 'block';
        startGame();
    } else {
        alert("Please enter names for both players!");
    }
};

startPVBBtn.onclick = () => {
    const userInput = document.getElementById('user-name').value.trim();

    if (userInput) {
        playerXName = userInput; // User is always 'X'
        playerOName = BOT_NAME;  // Bot is always 'O'
        isBotMode = true;
        gameSetupElement.style.display = 'none';
        gameElement.style.display = 'block';
        startGame();
    } else {
        alert("Please enter your name to play!");
    }
};

restartButton.addEventListener('click', startGame);

// --- Core Game Logic ---

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();

    winningMessageElement.classList.remove('show');
    updateBanner();
}

function handleClick(e) {
    if (isBotMode && oTurn) {
        return; 
    }

    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    
    placeMark(cell, currentClass);
    
    if (checkWin(currentClass)) {
        endGame(false);
    }
    else if (isDraw()) { 
        endGame(true);
    }
    else {
        swapTurns();
        if (isBotMode && oTurn) {
            // Initiate bot move after human plays and turns swap
            setTimeout(botMove, 700); // Give a slight delay for better UX
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
    setBoardHoverClass();
    updateBanner();
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (!winningMessageElement.classList.contains('show')) {
        board.classList.add(oTurn ? O_CLASS : X_CLASS);
    }
}

function updateBanner() {
    const currentPlayerName = oTurn ? playerOName : playerXName;
    const currentPlayerMark = oTurn ? 'O' : 'X';
    
    // Clear the auto-typing banner content once the game starts
    if(banner.textContent === bannertxt) {
        banner.textContent = '';
    }
    
    banner.textContent = `It's ${currentPlayerName}'s turn`;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'No winner, It\'s a TIE!';
    } else {
        const winnerName = oTurn ? playerOName : playerXName;
        winningMessageTextElement.innerText = `${winnerName} Wins! 🎉`
    }
    winningMessageElement.classList.add('show');
}

// ------------------------------------
// --- BOT (AI) LOGIC ---
// ------------------------------------

function botMove() {
    const botClass = O_CLASS;
    const humanClass = X_CLASS;
    
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
    });

    let move = getBestMove(botClass, availableCells);
    
    if (!move) {
        move = getBestMove(humanClass, availableCells);
    }

    if (!move) {
        move = availableCells.find(cell => cell === cellElements[4]);
    }
    if (!move) {
        const corners = [cellElements[0], cellElements[2], cellElements[6], cellElements[8]];
        move = availableCells.find(cell => corners.includes(cell));
    }
    if (!move) {
        if(availableCells.length > 0) {
            move = availableCells[Math.floor(Math.random() * availableCells.length)];
        }
    }

    // Execute the move
    if (move) {
        placeMark(move, botClass);
        if (checkWin(botClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
        }
    }
}

function getBestMove(checkedClass, availableCells) {
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        const combo = [cellElements[a], cellElements[b], cellElements[c]];
        
        let markedCount = 0;
        let emptyCell = null;

        combo.forEach(cell => {
            if (cell.classList.contains(checkedClass)) {
                markedCount++;
            } 
            else if (availableCells.includes(cell)) {
                if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)) {
                    emptyCell = cell;
                }
            }
        });

        if (markedCount === 2 && emptyCell) {
            return emptyCell;
        }
    }
    return null;
}
