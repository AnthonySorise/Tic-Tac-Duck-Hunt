var DuckLayer = function(){
    this.player0Score = 0;
    this.player1Score = 0;
    this.duckOccupiedSquares = [];
    this.duckHit = false;
    this.turnTime = 5000;
    this.playerTimer = null;

    this.startTimer = function(){
        //set duckHit to false
        //this.generateDucks
        //initiates timer as long as duckHit = false
            //otherwise, stop timer
        if (this.duckHit === false){
            this.playerTimer = setTimeout(this.generateDucks, 1000);
            this.playerTurnTimer();
        } else {
            this.stopTimer();
        }
    };

    this.playerTurnTimer = function(){

    };

    this.stopTimer = function(){
        //this.changePlayerTurn
        clearTimeout(this.playerTimer);
        ticTacMain.changePlayerTurn();
    };

    this.generateDucks = function(){
        //called by TicTacMain.
        //randomly determines number of remaining squares from availableSquareArray
        var duckSquares = [];
        var percentOfAvailSquares = Math.floor(Math.random()*(0.7-0.3))+0.3;
        console.log(percentOfAvailSquares);
        var numberOfDuckSquares = Math.floor(ticTacToe.availableSquareArray.length * percentOfAvailSquares);


        //randomly determine time ducks will appear and disappear
        //generate them, and put the ID of divs in duckOccupiedSquares while they are there
        //if click on div where id of div is in duckOccupiedSquares
            //run duckHit()

    };

    this.hitDuck = function(){
        //duckHit = true
        //TicTacMain.placePiece
        //TicTacMain.changePlayerTurn

        //updates the display
        //stopTimer()

        //update this.player0Score and this.player1Score
        this.duckHit = true;
        this.updateDisplay();
        this.stopTimer();
        this.player0Score += 10;
        this.player1score += 10;
    };

    this.updateDisplay = function(){
        //put dead ducks on squares based on TicTacMain.player0Squares and TicTacMain.player1Squares

        //updateScore in html.index;

    }


};