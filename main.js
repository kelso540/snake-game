import './style.css'

document.querySelector('#app').innerHTML = `
<div class="main-div">

    <canvas id="canvas" width="300" height="500"></canvas>

    <div class="button-div">
      <button class="up-btn btn">&#8679;</button>
      <div class="left-and-right-btns">
        <button class="left-btn btn">&#8678;</button>
        <button class="right-btn btn">&#8680;</button>
      </div>
      <button class="down-btn btn">&#8681;</button>
    </div>
    <div class="start-button-div">
      <button class="start-button btn">START</button>
      <button class="start-button-refresh btn">START</button>
    </div>
    <img src="/assets/snake-background.png" alt="snake" id="snake-background" />
    <img src="/assets/apple.png" alt="apple" id="apple-background" />
</div>`

// **** CANVAS SETTINGS **** //
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const gridSize = 20
const gridCount = canvas.width / gridSize

// **** HOLDS ALL GAME CONTENT G=GAME **** //
const g = {
  selectors: {
    startButtonRefresh: document.querySelector(".start-button-refresh"), 
    startButton: document.querySelector(".start-button"), 
    buttonDiv: document.querySelector(".button-div"),
    upBtn: document.querySelector(".up-btn"),
    dwnBtn: document.querySelector(".down-btn"),
    leftBtn: document.querySelector(".left-btn"),
    rightBtn: document.querySelector(".right-btn"),
  },
  snake: [
    {
      x: 20, 
      y: 20
    }
  ],
  food: {
    x: 20 * Math.floor(Math.random() * gridCount),
    y: 20 * Math.floor(Math.random() * gridCount),
  }, 
  x: 0,
  y: 0,
  score: 0, 
  snakeSpeed: 500,
  gameInterval: undefined,
  startGameText: "Press START to begin!", 
  controllsTextA: "Use arrow buttons or",
  controllsTextB: "keyboard arrows to move",
  endGameTextA: "GAME OVER", 
  endGameTextB: "Press start to replay", 
  snakeHeadColor: "darkgreen", 
  snakeColor: "green", 
  foodColor: "red", 
  snakeHeadBorderColor: "white", 
  snakeBodyBorderColor: "black",
  keyboardOn: false,
}

// **** IMAGES TO LOAD **** //
let apple = new Image();
apple.src = "/assets/apple.png";
let snakeHead = new Image();
snakeHead.src = "/assets/snake-head.png";

// **** MAIN GAME LOOP **** //
const drawGame = ()=>{
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawSnake(g.snake)
  addGameText()
}

// **** ADD TEXT TO CANVAS **** //
const addGameText = ()=>{
  ctx.textAlign = "center"
  ctx.font = "17px Arial"
  ctx.fillStyle = "black"
  ctx.fillText(g.controllsTextA, canvas.width/2, canvas.height-70)
  ctx.fillText(g.controllsTextB, canvas.width/2, canvas.height-50)
  ctx.fillText(g.startGameText, canvas.width/2, canvas.height-20)
}
const setGameText = ()=>{
  g.keyboardOn = true
  g.selectors.buttonDiv.style.display = "flex"
  g.selectors.startButton.style.display = "none"
  g.selectors.startButtonRefresh.style.display = "none"
  g.startGameText = "" 
  g.controllsTextA = ""
  g.controllsTextB = ""
}
const endGameText = ()=>{
  g.keyboardOn = false
  g.selectors.buttonDiv.style.display = "none"
  g.selectors.startButtonRefresh.style.display = "flex"
  ctx.textAlign = "center"
  ctx.font = "17px Arial"
  ctx.fillStyle = "black"
  ctx.fillText(g.endGameTextA, canvas.width/2, canvas.height-70)
  ctx.fillText(g.endGameTextB, canvas.width/2, canvas.height-50)
}

// **** ADDS SNAKE AND FOOD TO CANVAS **** //
const drawSnake = (object)=>{
  // **** SNAKE PASS CANVAS EDGE CONTROL **** //
  if(object[0].x + gridSize > canvas.width){
    object[0].x = 0
  }
  else if(object[0].x <= -20){
    object[0].x = canvas.width - gridSize
  }
  else if(object[0].y + gridSize > canvas.height){
    object[0].y = 0
  }
  else if(object[0].y <= -20){
    object[0].y = canvas.height - gridSize
  }
  // **** DRAW FOOD **** //
  ctx.drawImage(apple, g.food.x, g.food.y, gridSize, gridSize)
  // **** DRAW SNAKE HEAD **** //
  ctx.beginPath()
  ctx.arc(object[0].x+(gridSize/2), object[0].y+(gridSize/2), gridSize/2, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fillStyle = g.snakeHeadColor
  ctx.fill()
  // **** DRAW SNAKE BODY **** //
  ctx.fillStyle = g.snakeColor
  ctx.strokeStyle = g.snakeBodyBorderColor
  object.filter((item, index)=>index > 0).forEach(item=>{
    ctx.beginPath()
    ctx.arc(item.x+(gridSize/2), item.y+(gridSize/2), gridSize/2, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fillStyle = g.snakeColor
    ctx.fill()
  })
  ctx.fillStyle = "black"
  ctx.fillText("score - " + g.score, canvas.width/2, 20)
  addToSnake()
}

// **** ADDS SECTIONS TO START OF SNAKE ARRAY **** //
const addToSnake = ()=>{
  if(g.snake.length > 1){ 
    // **** LOOP CHECKS IF SNAKE HEAD HITS SNAKE BODY **** //
    for(let i = 1; i < g.snake.length; i++){
      if(g.snake[0].x === g.snake[i].x && g.snake[0].y === g.snake[i].y){
        // **** CHANGES COLOR OF SNAKE HEAD WHEN HEAD HITS BODY **** //
        ctx.beginPath()
        ctx.arc(g.snake[i].x+(gridSize/2), g.snake[i].y+(gridSize/2), gridSize/2, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.fillStyle = g.foodColor
        ctx.fill()
        // **** ENDS GAME **** //
        endGameText()
        clearInterval(g.gameInterval)
      }
    }
  }
  // **** CREATES NEW HEAD AND ADDS TO BEGINING OF ARRAY **** //
  const head = { 
    x: g.snake[0].x + g.x,
    y: g.snake[0].y + g.y
  }
  g.snake.unshift(head)
  // **** CHECKS IF HEAD HITS FOOD **** //
  if(head.x === g.food.x && head.y === g.food.y){
    g.food = {
      x: 20 * Math.floor(Math.random() * gridCount),
      y: 20 * Math.floor(Math.random() * gridCount),
    }
    g.score += 10
    g.snakeSpeed -= 10
    console.log(g.snakeSpeed)
    if(g.snakeSpeed < 40){
      g.snakeSpeed = 40
    }
    clearInterval(g.gameInterval)
    g.gameInterval = setInterval(drawGame, g.snakeSpeed)
  } else {
    // **** REMOVES LAST BODY SECTION TO ADD MOVEMENT **** //
    g.snake.pop()
  }
  checkFoodOnSnake()
}

// **** MAKES SURE FOOD DOESNT SPAWN ON SNAKE BODY **** //
const checkFoodOnSnake = ()=>{ 
  if(g.snake.length > 1){
    for(let i = 1; i < g.snake.length; i++){
      if(g.food.x === g.snake[i].x && g.food.y === g.snake[i].y){
        g.food = {
          x: 20 * Math.floor(Math.random() * gridCount),
          y: 20 * Math.floor(Math.random() * gridCount),
        }
      }
    }
  }
}

// **** GAME INTERVAL VARIABLE **** //
g.gameInterval = setInterval(drawGame, 500)

// **** KEYBOAD CONTROL **** //
const handleKeydown = (event)=>{
  const key = event.key;
  if (key === "ArrowUp" && g.y !== gridSize && g.keyboardOn) {
    g.x = 0
    g.y = -gridSize
  } else if (key === "ArrowDown" && g.y !== -gridSize && g.keyboardOn) {
    g.x = 0
    g.y = gridSize
  } else if (key === "ArrowLeft" && g.x !== gridSize && g.keyboardOn) {
    g.x = -gridSize
    g.y = 0
  } else if (key === "ArrowRight" && g.x !== -gridSize && g.keyboardOn) {
    g.x = gridSize
    g.y = 0
  }
}
document.addEventListener("keydown", handleKeydown);

// **** L, R, U, D, BUTTON CONTROL **** //
g.selectors.upBtn.addEventListener("click", ()=>{
  if (g.y !== gridSize) {
    g.x = 0
    g.y = -gridSize
  }
})
g.selectors.dwnBtn.addEventListener("click", ()=>{
  if (g.y !== -gridSize) {
    g.x = 0
    g.y = gridSize
  }
})
g.selectors.leftBtn.addEventListener("click", ()=>{
  if (g.x !== gridSize) {
    g.x = -gridSize
    g.y = 0
  }
})
g.selectors.rightBtn.addEventListener("click", ()=>{
  if (g.x !== -gridSize) {
    g.x = gridSize
    g.y = 0
  }
})

g.selectors.startButton.addEventListener("click", setGameText)
g.selectors.startButtonRefresh.addEventListener("click", ()=>{
  location.reload() 
})


// let resizeCanvas = () => { //resize canvas to page size(increase pixel COUNT). 
//     const canvas_ctxWidth = window.innerWidth - 100;
//     const canvas_ctxHeight = window.innerHeight - 100;
//     c.style.width = ' ' + canvas_ctxWidth + 'px'; 
//     c.style.height  = ' ' + canvas_ctxHeight + 'px';
// };
// window.addEventListener("resize", resizeCanvas); 
// resizeCanvas();