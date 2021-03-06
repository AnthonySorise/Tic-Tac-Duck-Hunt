function DuckLayer(){
    this.player0Score = 0;
    this.player1Score = 0;
    this.duckOccupiedSquares = [];
    this.dogOccupiedSquares = [];
    this.duckHit = false;
    this.dogHit = false;
    this.turnTime = 5000;
    this.currentTurnTime = 0;
    this.interval = 250;
    this.duckDurations = {}; //key = time spent in square, value = ID of square
    this.pointsPerDuck = 20;
    this.timerTimeRemaining = 5000;
    this.timer = null;
    this.timePerInterval = 10;

    this.startTimer = function(){ //Clicking on player gun starts turn = starts timer
        if (this.duckHit === false){ //check if duckHit === false
            this.playerTimer = setInterval(this.intervalFunction, this.interval); // will call generateDucks every half a second and generateDucks will either have the duck or not
            this.startTimerCountdown();
        }
    };

    this.startTimerCountdown = function(){
        this.timer = setInterval(this.timerAnimation, this.timePerInterval);
    };

    this.timerAnimation = function(){
        if(this.timerTimeRemaining / this.turnTime <= .33){
            $(".timer").css("background-color", "red");
        }
        this.timerTimeRemaining -= 10;
        if(this.timerTimeRemaining <= 0){
            this.timerTimeRemaining = 0;
            clearInterval(this.timer);
        }
        var percentRemaining = this.timerTimeRemaining / this.turnTime * 100;

        if(percentRemaining >= 80){
            this.pointsPerDuck = 20;
        }
        else if(percentRemaining <=20){
            this.pointsPerDuck = 5;
        }
        else{
            var middleTime = this.timerTimeRemaining - 1000;
            var percentOfMiddleTime = middleTime / 3000;
            this.pointsPerDuck = 5 + Math.round(15 * percentOfMiddleTime);
        }
        $(".timer").css('width', percentRemaining + '%');
    }.bind(this);
    this.intervalFunction = function(){
        this.currentTimeUpdater();
        this.generateRandomDuck();
        this.removeRandomGeneratedDuck();
    }.bind(this);

    this.currentTimeUpdater = function(){
        this.currentTurnTime += this.interval; //adding half a second to currentTurnTime every time the interval runs
    };

    this.stopTimer = function(){
        $(".timer").css("background-color", "gray");
        this.currentTurnTime = 0;
        clearInterval(this.playerTimer);
        clearInterval(this.timer);
        this.updateDisplay();
        this.resetDuckVar();
        this.timerTimeRemaining = 5000;
        $(".timer").css('width', "100%");
        this.pointsPerDuck = 20;
    };

    this.checkWinCondition = function(){
        ticTacToeLayer.checkWinCol();
        ticTacToeLayer.checkWinRow();
        ticTacToeLayer.checkWinDiag();
        ticTacToeLayer.changePlayerTurn();
    };

    this.resetDuckVar = function(){
        this.duckOccupiedSquares = [];
        this.dogOccupiedSquares = [];
        this.duckHit = false;
        this.currentTurnTime = 0;
        this.duckDurations = {};
        $(".gameSquare").each(function() { //removing background images at the end of the player turn"
            var duckAnimateSelection = $(this)[0].children[0];
            if (ticTacToeLayer.playerTurn === 0) {
                $(duckAnimateSelection).removeClass('animateDuck0');
            } else {
                $(duckAnimateSelection).removeClass('animateDuck1');
            }
            $(duckAnimateSelection).removeClass('animateDog');
        });
    };

    this.generateRandomDuck = function() {
        if(this.currentTurnTime === this.turnTime * 0.95){
            return
        }
        var percentChanceDuckAppears = 0.90;
        if (this.currentTurnTime >= this.turnTime) { //checking if currentTime === 5 seconds and if it is, stopTimer
            this.stopTimer();
            ticTacToeLayer.changePlayerTurn();
            audioHandler.miss();
        }
        if(this.currentTurnTime === 0){
            return
        }
        if (this.duckOccupiedSquares.length === 3) {            //determine percentage change of duck creation
            return                                              //looking at the length of duckOccupiedSquares array to determine the percentChange
        } else if (this.duckOccupiedSquares.length === 2) {
            percentChanceDuckAppears = 0.33
        } else if (this.duckOccupiedSquares.length === 1) {
            percentChanceDuckAppears = 0.75
        } else if (this.duckOccupiedSquares.length === 0) {
            percentChanceDuckAppears = 0.9
        }
        var checkToProceed = Math.random();
        if(checkToProceed > percentChanceDuckAppears){ //if random number > percent given above
            return
        }
        //chance of dog
        var dogGenerate = false;
        if(this.dogOccupiedSquares.length === 0){
            if(Math.random() < 0.10){
                dogGenerate = true;
            }
        }
        var availableUnoccupiedSquares = [];
        for(var i = 0; i < ticTacToeLayer.availableSquareArray.length; i++){ //looping through array in ticTacToeLayer.js containing all available div IDs
            if(this.duckOccupiedSquares.indexOf(ticTacToeLayer.availableSquareArray[i]) === -1 && this.dogOccupiedSquares.indexOf(ticTacToeLayer.availableSquareArray[i]) === -1){ //checking if duckOccupied squares array contains the same ID in the availableSquareArray
                availableUnoccupiedSquares.push(ticTacToeLayer.availableSquareArray[i]) //if there is no match, push those IDs to newly made array
            }
        }
        if(availableUnoccupiedSquares.length === 0) {
            return
        }
        var randomIndex = Math.floor(Math.random() * availableUnoccupiedSquares.length); //making random index based on availableUnoccupiedSquares length
        var randomDuckSquare = availableUnoccupiedSquares[randomIndex]; //assigning the unoccupiedSquare at index of randomDuckSquare, or duck, to a var
        if(!dogGenerate){ //a duck now occupies that square so push the ID of the square to the duckOccupiedSquares array
            this.duckOccupiedSquares.push(randomDuckSquare);
        }
        else{
            this.dogOccupiedSquares.push(randomDuckSquare);
        }
        var baseTimeWindow = this.turnTime / 5; //1000
        var percentageOfBaseTimeWindow = (Math.floor(Math.random()*(15-5))+5) * 0.1;
        var duckDuration = baseTimeWindow * percentageOfBaseTimeWindow;
        var duckLeaveTime = duckDuration + this.currentTurnTime;
        this.duckDurations[duckLeaveTime] = randomDuckSquare;
        var duckAnimateSelection = $('#' + randomDuckSquare)[0].children[0];
        if(!dogGenerate) {
            let className = 'animateDuck' + ticTacToeLayer.playerTurn;
            $(duckAnimateSelection).addClass(className); //adding animations via class
            audioHandler.quack();
        } else{
            $(duckAnimateSelection).addClass('animateDog'); //adding animations via class
            audioHandler.dog();
        }
    };

    this.removeRandomGeneratedDuck = function(){
        for (var key in this.duckDurations) { //looking for key in duckDurations object
            if (parseInt(key) <= this.currentTurnTime){ //if the key (time it should leave the square) is <= the currentTurnTime then remove duck
                var ID = this.duckDurations[key];
                var duckAnimateSelection = $('#' + ID)[0].children[0];
                if (this.duckOccupiedSquares.indexOf(ID) !== -1) {
                    var indexToRemove = this.duckOccupiedSquares.indexOf(this.duckDurations[key]);
                    this.duckOccupiedSquares.splice(indexToRemove, 1);
                    $(duckAnimateSelection).removeClass('animateDuck0').removeClass('animateDuck1');
                } else if (this.dogOccupiedSquares.indexOf(ID) !== -1){
                    var indexToRemove = this.dogOccupiedSquares.indexOf(this.duckDurations[key]);
                    this.dogOccupiedSquares.splice(indexToRemove, 1);
                    $(duckAnimateSelection).removeClass('animateDog');
                }
                delete this.duckDurations[key]
            }
        }
    };

    this.hitDuck = function(squareId) {
        audioHandler.hit();
        var duckAnimateSelection = $('#' + squareId)[0].children[0];
        this.duckHit = true; //changing duckHit to true if duck was in div clicked
        if (ticTacToeLayer.playerTurn === 0) {
            this.player0Score += this.pointsPerDuck; //update this.player0Score
            ticTacToeLayer.player0Squares.push(squareId);
        } else {
            this.player1Score += this.pointsPerDuck; //update this.player1Score
            ticTacToeLayer.player1Squares.push(squareId);
        }
        ticTacToeLayer.availableSquareArray.splice(ticTacToeLayer.availableSquareArray.indexOf(squareId), 1 );
        this.stopTimer();
        if(ticTacToeLayer.playerTurn === 0){
            $("#" + squareId).addClass("player0Sq");
            $(duckAnimateSelection).removeClass('animateDuck0'); //removing animations
        } else{
            $("#" +squareId).addClass("player1Sq");
            $(duckAnimateSelection).removeClass('animateDuck1'); //removing animations
        }
        $(duckAnimateSelection).removeClass('animateDog');
        this.checkWinCondition(); //check win
    };

    this.hitDog = function(squareID){
        audioHandler.miss();
        this.dogHit = true;
        this.stopTimer();
        this.checkWinCondition();
        $("#" + squareID).css({
            "background": "url(assets/dog_shot.png) no-repeat center",
            "background-size": "auto 100%"
        });
    };

    this.updateDisplay = function(){
        for(var i = 0; i < ticTacToeLayer.player0Squares.length; i++){
            $("#" + ticTacToeLayer.player0Squares[i]).css({
                "background": "url(assets/p0_duck_shot.png) no-repeat center",
                "background-size": "auto 100%"
            });
        }
        for(var i = 0; i < ticTacToeLayer.player1Squares.length; i++){
            $("#" + ticTacToeLayer.player1Squares[i]).css({
                "background": "url(assets/p1_duck_shot.png) no-repeat center",
                "background-size": "auto 100%"
            });
        }
        if (ticTacToeLayer.playerTurn === 0) { //updateScore in html.index;
            $('.player0ScoreVal').text(this.player0Score);
        } else {
            $('.player1ScoreVal').text(this.player1Score);
        }
    };
}
