const X_CLASS = 'x';
const O_CLASS = 'o';
let player1Name = ""; 
let player2Name = "";
const confBtn = document.getElementById('confirm');
let game = document.getElementById('game');
let players = document.getElementById('players');
let nameError = document.getElementById('nameError');

let banner = document.getElementById('banner');
let bannertxt = "www.stheshGames.org";
let charIndex = 0;
const intervalId = setInterval(() => {
    if (charIndex < bannertxt.length) {
        banner.textContent += bannertxt.charAt(charIndex);
        charIndex++;
    } else {
        clearInterval(intervalId);
    }
}, 500);

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.getElementById('winningMessageText');
const restartButton = document.getElementById('restartButton');
let oTurn;

confBtn.onclick = function() {
    const p1Input = document.getElementById('player1').value.trim();
    const p2Input = document.getElementById('player2').value.trim();

    if (p1Input !== "" && p2Input !== "") {
        player1Name = p1Input;
        player2Name = p2Input;

        players.style.display = 'none';
        game.style.display = 'block';

        if (nameError) nameError.textContent = "";
        startGame();

        console.log(`Player1 is: ${player1Name}`);
        console.log(`Player2 is: ${player2Name}`);

    } else {
        const errorText = "Cannot play with an empty player. Please enter both names!";
        
        if (nameError) {
            nameError.textContent = errorText;
        } else {
            alert(errorText); 
        }
    }
}

restartButton.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    board.classList.add(X_CLASS);

    winningMessageElement.classList.remove('show');
}

function handleClick(e) {
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
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    oTurn = !oTurn;
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    board.classList.add(oTurn ? O_CLASS : X_CLASS);
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
        winningMessageTextElement.innerText = 'No winner, It\'s a TIE';
    } else {
        winningMessageTextElement.innerText = `${oTurn ? player2Name : player1Name} Wins!`
    }
    winningMessageElement.classList.add('show');
}