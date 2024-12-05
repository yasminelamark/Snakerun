const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");
const buttonPause = document.querySelector(".btn-pause"); // Botão para pausar e retomar

const size = 30;

const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];
let direction, loopId;
let isPaused = false; // Variável de controle para pausar o jogo

// Funções auxiliares
const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};
const randomColor = () => {
  // Garantir que a comida tenha sempre cores brilhantes
  const colors = ['#FF6347', '#32CD32', '#FFD700', '#FF1493', '#00FFFF']; // Exemplo de paleta de cores vibrantes
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// Criando a const para a Apple
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor()
};

// Funções para desenhar no canvas
const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

const drawSnake = () => {
  // Alterando a cor do corpo da cobra
  ctx.fillStyle = "#00FF00"; // Cor verde neon

  snake.forEach((position, index) => {
    // Alterando a cor da cabeça
    if (index == snake.length - 1) {
      ctx.fillStyle = "#FF0000"; // Cor vermelha para a cabeça
    }

    ctx.fillRect(position.x, position.y, size, size);
  });
}
const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  }

  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  }

  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }

  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  }

  snake.shift();
};

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#DCDCDC";

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

const checkEat = () => {
  const head = snake[snake.length - 1];

  if (head.x == food.x && head.y == food.y) {
    incrementScore();
    snake.push(head);

    let x = randomPosition();
    let y = randomPosition();

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    gameOver();
  }
};

const gameOver = () => {
  direction = undefined;
  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

const gameLoop = () => {
  if (isPaused) return; // Se o jogo estiver pausado, não continue o loop

  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  loopId = setTimeout(() => {
    gameLoop();
  }, 300);
};

// Função para pausar o jogo
buttonPause.addEventListener("click", () => {
  isPaused = !isPaused; // Alterna entre pausar e retomar

  if (isPaused) {
    buttonPause.innerText = "Retomar"; // Altera o texto do botão para Retomar
  } else {
    buttonPause.innerText = "Pausar"; // Altera o texto do botão para Pausar
    gameLoop(); // Retoma o jogo
  }
});

// Botão para iniciar o jogo
buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";

  snake = [initialPosition];
  direction = "right"; // Define a direção inicial
  gameLoop(); // Inicia o loop do jogo
});

// Controle de direção da Snake
document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right";
  }

  if (key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }

  if (key == "ArrowDown" && direction != "up") {
    direction = "down";
  }

  if (key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
});
