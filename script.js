const secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let bestScore = localStorage.getItem('bestScore') || '-';

const userGuess = document.getElementById('userGuess');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const bestScoreDisplay = document.getElementById('bestScore');
const gameHint = document.getElementById('gameHint');
const timerDisplay = document.getElementById('timerDisplay');
const confettiContainer = document.querySelector('.confetti-container');

let timer;
let timerValue = 60;
let confettiActive = false;

function showMessage(msg, color) {
    message.textContent = msg;
    message.style.color = color;
}

function showGameHint(msg) {
    gameHint.textContent = msg;
}

function resetGame() {
    attempts = 0;
    attemptsDisplay.textContent = attempts;
    userGuess.value = '';
    userGuess.disabled = false;
    userGuess.focus();
    showMessage('Good luck!', '#ff4444');
    showGameHint('Make a guess!');
    clearInterval(timer);
    timerValue = 60;
    timerDisplay.textContent = timerValue + ' seconds';
    confettiContainer.innerHTML = '';
    confettiActive = false;
    gameResult.classList.add('hidden');
}

function playSound(sound) {
    const audio = document.getElementById(sound);
    audio.currentTime = 0;
    audio.play();
}

function createConfetti() {
    const numConfetti = 100;
    for (let i = 0; i < numConfetti; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.classList.add('confetti');
        confettiPiece.style.left = Math.random() * window.innerWidth + 'px';
        confettiPiece.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(confettiPiece);
    }
}

function displayGameResult(message, color) {
    showMessage(message, color);
    if (!confettiActive) {
        confettiActive = true;
        createConfetti();
    }

    gameResult.textContent = message;
    gameResult.style.color = color;
    gameResult.classList.remove('hidden');
}

function checkGuess() {
    const guess = Number(userGuess.value);
    if (isNaN(guess) || guess < 1 || guess > 100) {
        showMessage('Please enter a valid number between 1 and 100.', '#ff4444');
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    if (guess === secretNumber) {
        userGuess.disabled = true;
        showMessage(`Congratulations! You guessed the secret number ${secretNumber}!`, '#00cc44');
        if (attempts < bestScore || bestScore === '-') {
            bestScore = attempts;
            localStorage.setItem('bestScore', bestScore);
            bestScoreDisplay.textContent = bestScore;
        }

        displayGameResult(`Congratulations! You guessed the secret number ${secretNumber}!`, '#00cc44');
        clearInterval(timer);
    } else if (guess < secretNumber) {
        showMessage('Try a higher number.', '#ffbb33');
    } else {
        showMessage('Try a lower number.', '#ffbb33');
    }
}

submitBtn.addEventListener('click', checkGuess);
userGuess.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

resetBtn.addEventListener('click', () => {
    resetGame();
    playSound('wrongSound');
});

resetGame();
timer = setInterval(() => {
    timerValue--;
    timerDisplay.textContent = timerValue + ' seconds';
    if (timerValue === 0) {
        userGuess.disabled = true;
        showMessage(`Time's up! The secret number was ${secretNumber}.`, '#ff4444');
        displayGameResult(`Time's up! The secret number was ${secretNumber}.`, '#ff4444');
        clearInterval(timer);
    }
}, 1000);
