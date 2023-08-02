document.addEventListener("DOMContentLoaded", function () {
    let secretNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    const maxAttempts = 10;
    let bestScore = localStorage.getItem('bestScore') || '-';

    const userGuess = document.getElementById('userGuess');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const hintBtn = document.getElementById('hintBtn');
    const attemptsDisplay = document.getElementById('attempts');
    const bestScoreDisplay = document.getElementById('bestScore');
    const maxAttemptsDisplay = document.getElementById('maxAttempts');
    const timerDisplay = document.getElementById('timerDisplay');
    const gameResult = document.getElementById('gameResult');

    let timer;
    let timerValue = 60;

    function showMessage(msg, color) {
        gameResult.textContent = msg;
        gameResult.style.color = color;
        gameResult.classList.remove('hidden');
    }

    function resetGame() {
        attempts = 0;
        attemptsDisplay.textContent = attempts;
        bestScoreDisplay.textContent = bestScore;
        userGuess.value = '';
        userGuess.disabled = false;
        userGuess.focus();
        showMessage('Make a guess!', '#00e676'); // Green color for message
        clearTimeout(timer);
        timerValue = 60;
        timerDisplay.textContent = timerValue + ' seconds';
        gameResult.classList.add('hidden');
        secretNumber = Math.floor(Math.random() * 100) + 1;
        hintBtn.disabled = false;

        // Start a new timer after resetting the game
        startTimer();
    }

    function displayGameResult(message, color) {
        showMessage(message, color);
        userGuess.disabled = true;
        bestScore = attempts < parseInt(bestScore) || bestScore === '-' ? attempts : bestScore;
        localStorage.setItem('bestScore', bestScore);
        bestScoreDisplay.textContent = bestScore;
        hintBtn.disabled = true;
    }

    function checkGuess() {
        if (userGuess.disabled) return;

        const guess = parseInt(userGuess.value);
        attempts++;

        if (guess === secretNumber) {
            displayGameResult('Congratulations! You guessed the number!', '#00e676'); // Green color for correct guess
        } else {
            const messageColor = guess < secretNumber ? '#ff3d00' : '#00e676'; // Red color for wrong guess, green for hints
            showMessage(guess < secretNumber ? 'Too low! Try again.' : 'Too high! Try again.', messageColor);
        }
        attemptsDisplay.textContent = attempts;

        if (attempts >= maxAttempts) {
            userGuess.disabled = true;
            displayGameResult(`Game over! The secret number was ${secretNumber}.`, '#ff3d00'); // Red color for game over result
        }
    }

    function giveHint() {
        const hintColor = '#1dd1a1'; // Green color for hints
        showMessage(`The secret number is ${(secretNumber % 2 === 0) ? 'even' : 'odd'}.`, hintColor);
    }

    submitBtn.addEventListener('click', checkGuess);

    userGuess.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkGuess();
        }
    });

    resetBtn.addEventListener('click', resetGame);
    hintBtn.addEventListener('click', giveHint);

    function startTimer() {
        timerValue--;
        timerDisplay.textContent = timerValue + ' seconds';

        if (timerValue === 0) {
            userGuess.disabled = true;
            displayGameResult('Time\'s up! Better luck next time.', '#ff3d00'); // Red color for time's up result
        } else {
            timer = setTimeout(startTimer, 1000);
        }
    }

    // Start the initial timer
    startTimer();
});
