const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("../som/assets_audio.mp3");

//o tamanho do quadrado de cada campo
const size = 30;

//determina a posição inicial da cobrinha
const initialPosition = { x: 270, y: 240 };

let snake = [initialPosition];

const incrementScore = () => {
    score.innerText = + score.innerText + 1;
}

//gerar um número aleatório
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

// determinando a posição da comida a partir do número gerado anteriormente
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

//gerará numeros aleatórios que serão usados para determinar a cor das comidas
const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId;

const drawFood = () => {
    const { x, y, color } = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 5;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
}

//função responsavel por desenhar a cobra
const drawSnake = () => {
    ctx.fillStyle = " #ddd";

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x, position.y, size, size);
    })
}

//determinará a direção que a cobra irá se mover
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
}

//desenhando a grid do campo
//função responsavel por verificar se a cobrinha chegou ao final do "campo"
const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

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
}


const chackEat = () => {
    const head = snake[snake.length - 1];

    //quando a cobrinha comer acrescentará um ponto ao jogador e o audio será tocado
    if (head.x == food.x && head.y == food.y) {
        incrementScore();
        snake.push(head);
        audio.play();

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
}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision =
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    })

    if (wallCollision || selfCollision) {
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined;

    menu.style.display = "flex";
    finalScore.innerText = score.innerText; //adicionando pontuação do jogador
    canvas.style.filter = "blur(2px)"; //escurecer a tela
}

//looping
const gameLoop = () => {

    //limpar a tela
    clearInterval(loopId);

    ctx.clearRect(0, 0, 600, 600);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    chackEat();
    checkCollision();

    //setTimeout é usado para executar um bloco de código após um atraso determinado 
    loopId = setTimeout(() => {
        gameLoop();
    }, 300);
}

gameLoop();

//determinando setas do teclado e suas determinadas direções
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
})

//determinando posição inicial da cobrinha para começar o jogo e removendo o "menu" da tela
buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";

    snake = [initialPosition];
});