const X_CLASS = 'x';
const O_CLASS = 'o';
const player1 = document.getElementById('player1').value.trim();
const player2 = document.getElementById('player2').value.trim();
const confBtn = document.getElementById('confirm');
let game = document.getElementById('game')
let players = document.getElementById('players');
if(player1 != "" && player2 != ""){
	confBtn.onclick = function(){
		players.style.display = 'none';
		game.style.display = 'block';
	}
} else {
	document.write("Cannot play with an empty player")
	document.write("!!!Enter player names then refresh the page!!!")
}
console.log(`Player1 is: ${player1}`)
console.log(`Player2 is: ${player2}`)
let banner = document.getElementById('banner')
let bannertxt = "www.stheshGames.org";
let charIndex = 0;
const intervalId = setInterval(() => {
    if (charIndex < bannertxt.length) {
        banner.textContent += bannertxt.charAt(charIndex);
        charIndex++;
    } else {
        clearInterval(intervalId);
    }
}, 150);

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

restartButton.addEventListener('click', startGame);

function startGame() {
    oTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
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
        winningMessageTextElement.innerText = `${oTurn ? player2 : player1} Wins!`
    }
    winningMessageElement.classList.add('show');
}

startGame();