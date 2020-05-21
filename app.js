document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10 // width means the size of the total board. its a 10x20

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
    
    let currentPosition // sets the position
    let currentRotation // and rotation
    let current // current tetromino

    selectTetromino()

    // Select Tetromino
    function selectTetromino() {
      currentRotation = 0
      // randomly select a Tetromino and its first rotation
      let random = Math.floor(Math.random()*theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
    }

    // draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    //undraw the tetromino
    function undraw () {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
      })
    }

    // a game loop will occur ever 1 seconds
    gameTick = setInterval(gameLoop, 1000)

    // controls - functions are assigned to keycodes
    function control(e) {
      switch(e.keyCode) {
        case 37: // left arrow
          moveLeft()
          break;
        case 38: // up arrow
          //rotate
          break;
        case 39: // right arrow
          moveRight()
          break;
        case 40: // down arrow
          //moveDown()
          break;
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

})