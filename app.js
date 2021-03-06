// RULEBOOK: https://tetris.fandom.com/wiki/Tetris_Guideline

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10 // width means the size of the total board. its a 10x20
    let gameTick = null
    let score = 0
    const colours = [ //colours must be defined in order of the tetrominos
      'orange', 'red', 'purple', 'yellow', 'cyan'
    ]

    // Tetrominoes - each shape has 4 rotations which are represented by a multi-dim array.
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
      ]
      const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    
    let currentPosition = 4 // sets the position
    let currentRotation = 0 // and rotation
    let random = Math.floor(Math.random()*theTetrominoes.length) // sets random index for tetromino
    let nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation] // current tetromino
    
    selectTetromino()

    // Select Tetromino
    function selectTetromino() {
      currentRotation = 0
      // randomly select a Tetromino and its first rotation
      random = nextRandom
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
    }

    // draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colours[random]
        })
    }

    //undraw the tetromino
    function undraw () {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
      })
    }

    // controls - functions are assigned to keycodes
    function control(e) {
      if (gameHasNotEnded = true) {
        switch(e.keyCode) {
          case 37: // left arrow
            moveLeft()
            break;
          case 38: // up arrow
            rotate()
            break;
          case 39: // right arrow
            moveRight()
            break;
          case 40: // down arrow
            gameLoop()
            break;
        }
      }
    }

    document.addEventListener('keyup', control) // event listener to call the control function when a key is pressed

    // move down function
    function gameLoop() {
      undraw()
      currentPosition += width
      draw()
      freeze() // conditional
    }

    function freeze() {
      // if the tetromino detects a square denoted as taken, it will freeze in place
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken')) // denotes that the square has been taken by a tetromino
        // start a new tetromino falling
        selectTetromino()
        displayShape()
        addScore()
        gameOver()
      }
    }


    // GAME RULES AND BEHAVIOUR
    
    // Move a tetromino left. A tetromino CANNOT go left if there is an edge or enter a taken square
    function moveLeft() {
      undraw() // delete
      // checks array to see if current tetromino's position divided by square width has no remainder.
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0) // this works because the left edge will always have no remainder (pos: 10, 20 etc)

      // if any square of a tetromino is not at the left edge, then move left
      if(!isAtLeftEdge) currentPosition-=1 // the tetromino will move left. because no behavior is defined if there is a left edge, it wont move

      // if the tetromino detects a taken square, it will be pushed back. otherwise the tetromino will freeze inside another
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition+=1
      }

      draw() // update
    }

    // Move a tetromino right. A tetromino CANNOT go right if there is an edge or enter a taken square
    function moveRight() {
      undraw() // delete
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1) // positions of squares that are right edge: 9,18,27 etc. take the width and minus 1

      // if any square of the tetromino is not at the right edge, then move right
      if (!isAtRightEdge) currentPosition+=1

      // push tetromino if it detects a taken square
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition-=1
      }

      draw() //update
    }

    // Rotate a Tetromino
    function rotate() {
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === (width - 1));

      if (!(isAtLeftEdge | isAtRightEdge)) {
        undraw() // delete
        currentRotation++ // increases the current rotation index
        // if the rotation is at maximum index (index 3 because there are four rotations), wrap it around to 0
        if(currentRotation === current.length) {
          currentRotation = 0
        }
        // select the new rotation of the current tetromino, without updating the current position
        current = theTetrominoes[random][currentRotation]
      }
      draw()
    }

    // Add score when row is filled
    function addScore() {
      for (let i = 0; i < 199; i += width) { // loops through each square on the board
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9] // define a row
        if (row.every(index => squares[index].classList.contains('taken'))) { // if every square in the defined row is taken...
          // add and update score
          score +=10
          scoreDisplay.innerHTML = score
          //remove row's taken class and styling
          row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
          })
          // remove row
          const squaresRemoved = squares.splice(i, width) // splices the square starting from the current loop index to the edge (full width)
          squares = squaresRemoved.concat(squares) // combine array
          squares.forEach(cell => grid.appendChild(cell))
          // add a new row
        }
      }
    }

    // Game ends when height is filled
    function gameOver() {
      if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        document.querySelector('#end').innerHTML = 'END'
        clearInterval(gameTick)
        gameHasNotEnded = false
      }
    }
    // Flashing tetromino to show game is over
    function flashTetromino() {
      //if (document.)
    }


    // Button Event Listener
    startBtn.addEventListener('click', () => {
      if (gameTick) {
        startBtn.innerHTML = 'Resume'
        clearInterval(gameTick)
        gameTick = null
      } else {
        startBtn.innerHTML = 'Pause' // button text is paused
        draw()
        gameTick = setInterval(gameLoop, 1000) // each game tick is 1 second, each tick calls the game loop which moves it down
        nextRandom = Math.floor(Math.random()*theTetrominoes.length) // set the next random tetromino index
        displayShape() // show next tetromino in mini grid
      }
    })




  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.sidebar .mini-grid div')
  const displayWidth = 4
  const displayIndex = 0


  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom]
    })
  }

})