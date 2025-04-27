const gameGrid = document.getElementById('game-grid');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score'); // Nuevo elemento para mejor puntaje
const message = document.getElementById('message');
let sequence = [];
let playerInput = [];
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0; // Cargar del localStorage
let gameInterval;
const totalCards = 36; 
const basePoints = 3; // Puntos base por secuencia correcta
const penalty = 0; // Penalización por error

// Al cargar la página, mostrar el mejor puntaje
highScoreDisplay.textContent = `Mejor puntaje: ${highScore}`;

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame); // Añadir evento al botón de reinicio

function startGame() {
    score = 0; // Reiniciar el puntaje
    playerInput = [];
    sequence = []; // Reiniciar la secuencia
    startButton.classList.add('hidden');
    restartButton.classList.add('hidden'); // Ocultar el botón de reinicio al iniciar
    message.textContent = '';
    scoreDisplay.textContent = `Score: ${score}`;
    resetBoard();
    nextRound();
}

function nextRound() {
    playerInput = [];
    sequence.push(Math.floor(Math.random() * totalCards));
    resetBoard();
    showSequence();
}

function resetBoard() {
    gameGrid.innerHTML = ''; 
    for (let i = 0; i < totalCards; i++) {
        const card = document.createElement('div');
        card.classList.add('card', 'disabled');
        card.addEventListener('click', handleCardClick);
        gameGrid.appendChild(card);
    }
}

function showSequence() {
    disableClicks();
    let index = 0;
    gameInterval = setInterval(() => {
        const cards = document.querySelectorAll('.card');
        if (index > 0) {
            cards[sequence[index - 1]].classList.remove('active');
        }
        
        if (index < sequence.length) {
            cards[sequence[index]].classList.add('active');
            playSound('correct-sound'); // Reproduce sonido al mostrar la secuencia
            index++;
        } else {
            clearInterval(gameInterval);
            setTimeout(() => {
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => card.classList.remove('active'));
                enableClicks();
            }, 500);
        }
    }, 1000);
}

function handleCardClick(event) {
    const clickedIndex = Array.from(document.querySelectorAll('.card')).indexOf(event.target);
    playerInput.push(clickedIndex);
    playSound('select-sound'); // Reproduce sonido al seleccionar
    checkInput(clickedIndex);
}

function checkInput(clickedIndex) {
    const cards = document.querySelectorAll('.card');
    if (clickedIndex !== sequence[playerInput.length - 1]) {
        cards[clickedIndex].classList.add('wrong');
        playSound('wrong-sound'); // Reproduce sonido de error
        score = Math.max(0, score - penalty); // Restar puntos en caso de error
        disableClicks();
        message.textContent = '"¡Oops! Inténtalo de nuevo."';
        updateHighScore(); // Actualizar el mejor puntaje
        showRestartButton();
    } else {
        cards[clickedIndex].classList.add('completed');
        if (playerInput.length === sequence.length) {
            score += basePoints; // Añadir puntos base
            scoreDisplay.textContent = `Score: ${score}`;
            setTimeout(nextRound, 1000);
        }
    }
}

function updateHighScore() {
    // Actualiza el mejor puntaje solo si el puntaje actual es mayor
    if (score > highScore) {
        highScore = score; // Actualiza el mejor puntaje
        localStorage.setItem('highScore', highScore); // Guardar en localStorage
    }
    highScoreDisplay.textContent = `Mejor puntaje: ${highScore}`; // Muestra el mejor puntaje
}

function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0; // Reiniciar el sonido para evitar retrasos
    sound.play();
}

function disableClicks() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('disabled');
        card.removeEventListener('click', handleCardClick);
    });
}

function enableClicks() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('disabled');
        card.addEventListener('click', handleCardClick);
    });
}

function showRestartButton() {
    restartButton.classList.remove('hidden'); // Mostrar el botón de reinicio
}

resetBoard();