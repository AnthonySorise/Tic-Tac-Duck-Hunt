function TicTacMain(dim,winCond){	//will eventually need to take in winning condition number
	this.self = this;
	this.dimension = dim;
	this.winNumber = winCond; 
	this.playerTurn = 0;	//will always be either 0 or 1
							/*player turn tracker
								0 : o turn  ||| 1 : x turn*/
	this.availableSquareArray = []; //will be populated createBoard containing all square ids
	this.player0Squares = []; //ids of player occupied squares
	this.player1Squares = []; 
	this.totalSquareNumber = 0;
	this.gameOver = false; 		//set to true if a player wins. 
	this.gameWinner = 0;		/*changed in functions checking winning condition*/
	this.createBoard = function(){
		var divRowHeight = 100/this.dimension;
		var gameSquareWidth = 100/this.dimension;
		for(var i=0; i<this.dimension; i++){
			$('<div>').addClass('row').attr('id','row'+i).appendTo('.gameScreenMonitor').css('height',divRowHeight+'%');
			for(var j=0; j<this.dimension; j++){
				var boardGrid = $('<div>').addClass('gameSquare').attr('id',i.toString()+j.toString()).css({
					'width':gameSquareWidth+'%',
					'height':'100%', 
					'z-index':'1'
				}).click(function(){
					ticTacMain.clickGameSquare($(this).attr('id'));
				});
				var innerDiv = $("<div>").css({
					'height':'100%', 
					'width':'auto' + 20, 
					'margin':"auto"
				});
				boardGrid.append(innerDiv);
				$("#row" + i).append(boardGrid);
				this.availableSquareArray.push(i.toString()+j.toString());
			}
		}
		// console.log(this.availableSquareArray);
	};

	this.clickGameSquare = function(squareID){ //will have $().attr('id') passed in
        audioHandler.shoot();
		//white screen
		$(".gameScreenMonitor").css("background", "none");

		setTimeout(function(){
            $(".gameScreenMonitor").css({
            	"background": "url(assets/background.png)",
            	"background-size": "100% 100%"
            });
		}, 20);

		//conditional checking player turn was removed | duck object can access that data
		for(var i=0; i<duckLayer.duckOccupiedSquares.length; i++){	//traverse through available squares with ducks inside them
			if(duckLayer.duckOccupiedSquares[i]==squareID){	//if clicked squareID is inside the array, call hitDuck function
				// return duck.hitDuck();	//may need to use return before function call to exit loop
				duckLayer.hitDuck(squareID);	//hitDuck function needs to update player0/1Squares array
				return;
			}
			else if(duckLayer.dogOccupiedSquares[i]==squareID){
				//FUNCTION THAT ENDS GAME
				duckLayer.hitDog(squareID);
				return;
			}
		}
	};

	//needs to call hitDuck in duck object
	//places either x or o on the square
	//go through duckoccupied square in duck object to check condition
			// will call function that switches player turn - changePalyerTurn
			//needs to call function that updates global array of available squares
			//splice squareID from availableSquareArray and push to playerSquare array to current player

	this.changePlayerTurn = function(){
		playerTurnStartClicked = false;
		if(duckLayer.dogHit){	//if the dog hit bool turns true, stop game
				if(this.playerTurn === 0){
					$('.player0Area').unbind('click',playerTurnStart).css("opacity","0.3");
                    $('.player1Area').css("opacity","1");
                    $('.player0Score').css("opacity","0.3");
                    $('.player1Score').css("opacity","1");
                    $('.player1Name').addClass("playerFocusHighlight");
                    $('.player0Name').removeClass("playerFocusHighlight");
                    displayUIMenu("Player 2 Wins: Player 1 shot the dog!  Press RESET to play again!");
                    //$('.winnerMessageDisplay').text('P2 Wins: Player 1 shot the dog!');
					this.gameOver = true;
					return;
				}else if(this.playerTurn ===1){
					$('.player1Area').unbind('click',playerTurnStart).css("opacity","0.3");
                    $('.player0Area').css("opacity","1");
                    $('.player1Score').css("opacity","0.3");
                    $('.player0Score').css("opacity","1");
                    $('.player0Name').addClass("playerFocusHighlight");
                    $('.player1Name').removeClass("playerFocusHighlight");
                    displayUIMenu("Player 1 Wins: Player 2 shot the dog!  Press RESET to play again!");
					//$('.winnerMessageDisplay').text('P1 Wins: Player 2 shot the dog!');
					this.gameOver = true;
					return;
				}
			}
		if(!this.gameOver){
			this.totalSquareNumber = this.player0Squares.length+this.player1Squares.length;
			if(this.totalSquareNumber===(this.dimension*this.dimension)){
				this.gameOver = true;
				if(this.playerTurn === 0){
					$('.player0Area').unbind('click',playerTurnStart);
				}else if(this.playerTurn ===1){
					$('.player1Area').unbind('click',playerTurnStart);
				}
				if(duckLayer.player0Score > duckLayer.player1Score){
					displayUIMenu("Player 1 wins with higher score!  Press RESET to play again!")
					return;
					//$('.winnerMessageDisplay').text('Player 1 wins with more ducks');
				}else if(duckLayer.player0Score < duckLayer.player1Score){
                    displayUIMenu("Player 2 wins with higher score!  Press RESET to play again!")
                    return;
					//$('.winnerMessageDisplay').text('Player 2 Wins with more ducks');
				}
			}
			else if(this.playerTurn === 0){
				this.playerTurn = 1;
				$('.player0Area').unbind('click', playerTurnStart);
				$('.player1Area').bind('click',playerTurnStart);
                $('.gameScreenMonitor').removeClass('cursorPlayer0').addClass('cursorPlayer1');
                $('.container-fluid').removeClass('gunCursorPlayer0').addClass('gunCursorPlayer1');
                displayUIMenu("Player 2: Press your zapper to start your turn!");
				$('.player0Name').removeClass('playerFocusHighlight');
				$('.player0Area').css("opacity","0.3");
                $('.player1Area').css("opacity","1");
                $('.player0Score').css("opacity","0.3");
                $('.player1Score').css("opacity","1");
				$('.player1Name').addClass('playerFocusHighlight');
            	// console.log("player 1 turn");
				return;
			}else if(this.playerTurn === 1){
            	this.playerTurn = 0;
				$('.player1Area').unbind('click',playerTurnStart);
				$('.player0Area').bind('click',playerTurnStart);

                $('.gameScreenMonitor').removeClass('cursorPlayer1').addClass('cursorPlayer0');
                $('.container-fluid').removeClass('gunCursorPlayer1').addClass('gunCursorPlayer0');
                displayUIMenu("Player 1: Press your zapper to start your turn!");
				$('.player1Name').removeClass('playerFocusHighlight');
                $('.player1Area').css("opacity","0.3");
                $('.player0Area').css("opacity","1");
                $('.player1Score').css("opacity","0.3");
                $('.player0Score').css("opacity","1");
				$('.player0Name').addClass('playerFocusHighlight');
            	// console.log("player 0 turn");
				return;
			}
		}else if(this.gameOver){
			if(this.playerTurn === 0){
				$('.player0Area').unbind('click',playerTurnStart);
			}else if(this.playerTurn ===1){
				$('.player1Area').unbind('click',playerTurnStart);
			}
			if(this.gameWinner===0){
                displayUIMenu("Player 1 Wins!  Press RESET to play again!");
				//$('.winnerMessageDisplay').text('Player 1 Wins');
			}else if(this.gameWinner === 1){
                displayUIMenu("Player 2 Wins!  Press RESET to play again!");
				//$('.winnerMessageDisplay').text('Player 2 Wins');
			}
		}
		//unlocks gun for current player
		//change crosshairs to match current player
	}; 
	/*called by placePiece either decrement or increment playerTurn depending on player turn
		duck obje*/

	/*function for winning condition*/
	/*for checking win condition call the three functions after the function that places player markers on the board
	e.g.
		ticTacMain.checkWinRow();
		ticTacMain.checkWinCol();
		ticTacMain.checkWinDiag();	*/
	this.checkWinRow = function (){
		
		for(var i=0; i<this.dimension;i++){		//outer loop iterates rows
			var player0Pt = 0;	//if there are enough consequtive rows in play, this point will match the necessary win square number
			var player1Pt = 0;
			for(var j=0; j<this.dimension;j++){	//inner loop iterates through each square inside the row
				var currentSquare = $('#'+i+j); //targets the current square in iteration for comparison
				if(currentSquare.hasClass('player0Sq')){	//if the square has class matching whichever player that clicked; checking square div class not image class
					player0Pt++;							//increment the matching player's point checker
				}else{					
					player0Pt = 0;							//if there is a gap in the middle of missing square, 
				}											//point is set back to zero; essentially check if squares available are consequtive
				if(currentSquare.hasClass('player1Sq')){
					player1Pt++;
				}else{
					player1Pt = 0;
				}
				if(player0Pt ==this.winNumber){
					// console.log('player 0 wins; triggered at row win check');
					this.gameOver = true;
					this.gameWinner = 0;
					return;
					//call function that updates ui with player 0 win
				}
				if(player1Pt == this.winNumber){
					// console.log('player 1 wins; triggered at row win check');
					this.gameOver = true;
					this.gameWinner = 1;
					return;
					//call function updating ui with player 1 win
				}
			}
		}
	};
	this.checkWinCol = function(){
		
		for(var i=0; i<this.dimension; i++){ 		//outer loop keeps id number confined to column
			var player0Pt = 0;
			var player1Pt = 0;
			for(var j=0; j<this.dimension; j++){ 	//inner loop iterates through each row at every column
				var currentSquare = $('#'+j+i);
				if(currentSquare.hasClass('player0Sq')){
					player0Pt++;
				}else{
					player0Pt = 0;
				}
				if(currentSquare.hasClass('player1Sq')){
					player1Pt++;
				}else{
					player1Pt = 0;
				}
				if(player0Pt == this.winNumber){
					// console.log('player 0 wins; triggered at col win check');
					this.gameOver = true;
					this.gameWinner = 0;
					return;
					//call function updating ui with player 0 win
				}
				if(player1Pt == this.winNumber){
					// console.log('player 1 wins; triggered at col win check');
					this.gameOver = true;
					this.gameWinner = 1;
					return;
				}
			}
		}
	};
	this.checkWinDiag = function(){
		for(var i=0; i<this.dimension; i++) {
            for (var j = 0; j <this.dimension; j++) {
                var player0PtLR = 0;
                var player1PtLR = 0;
                var proceedP0 = true;
                var proceedP1 = true;
                var currentX = i;
                var currentY = j;
                var currentSquare = $('#'+ currentX + currentY);
                if(currentSquare.hasClass('player0Sq') || currentSquare.hasClass('player1Sq')){
                    player0PtLR = 1;
                    player1PtLR = 1;
                	while((currentX+1 < this.dimension) && (currentY+1 < this.dimension) && (player0PtLR != this.winNumber) && (player1PtLR != this.winNumber)){
                        currentX += 1;
                        currentY += 1;
                        currentSquare = $('#'+ currentX + currentY);
                        if(currentSquare.hasClass('player0Sq') && proceedP0){
                            player0PtLR+=1;
                        }
                        else{
                            proceedP0 = false;
                            player0PtLR = 0;
                        }
                        if (currentSquare.hasClass('player1Sq') && proceedP1){
                            player1PtLR+=1;
                        }
                        else{
                        	proceedP1 = false;
                            player1PtLR = 0;
                        }
					}

				}
                var player0PtRL = 0;
                var player1PtRL = 0;
                proceedP0 = true;
                proceedP1 = true;
                currentX = i;
                currentY = j;
                currentSquare = $('#'+ currentX + currentY);
                if(currentSquare.hasClass('player0Sq') || currentSquare.hasClass('player1Sq')){
                    player0PtRL = 1;
                    player1PtRL = 1;
                	while((currentX-1 >= 0) && (currentY+1 < this.dimension) && (player0PtRL != this.winNumber) && (player1PtRL != this.winNumber)){
                        currentX -= 1;
                        currentY += 1;
                        currentSquare = $('#'+ currentX + currentY);
                        if(currentSquare.hasClass('player0Sq') && proceedP0){
                            player0PtRL+=1;
                        }
                        else{
                            proceedP0 = false;
                            player0PtRL = 0;
                        }
                        if (currentSquare.hasClass('player1Sq') && proceedP1){
                            player1PtRL+=1;
                        }
                        else{
                            proceedP1 = false;
                            player1PtRL = 0;
                        }
                    }
                }
                if(player0PtLR == this.winNumber || player0PtRL == this.winNumber){
                	// console.log('player 0 wins; triggered at diagonal win check');
					this.gameOver = true;
					//call function for ui update
					this.gameWinner = 0;
					return;
				}
				else if(player1PtLR == this.winNumber || player1PtRL == this.winNumber){
                    // console.log('player 1 wins; triggered at diagonal win check');
                    this.gameOver = true;
                    //call function for ui update
                    this.gameWinner = 1;
                    return;
				}
            }
        }
    }



	// this.checkWinDiag = function(){ 		//this function checks both tLeft-bRight and tRight-bLeft diagonals
	// 	var player0PtLR = 0;
	// 	var player1PtLR = 0;
	// 	for(var i=0; i<this.dimension; i++){ 	//checking top left to bottom right
	//
	// 		var currentSquare = $('#'+i+i);		//the col/row index in this direction should increment equally; therefore only one loop
	// 		if(currentSquare.hasClass('player0Sq')){
	// 			player0PtLR++;
	// 		}else{
	// 			player0PtLR = 0;
	// 		}
	// 		if(currentSquare.hasClass('player1Sq')){
	// 			player1PtLR++;
	// 		}else{
	// 			player1PtLR = 0;
	// 		}
	// 		if(player0PtLR == this.winNumber){
	// 			// console.log('player 0 wins; triggered at diagonal win check');
	// 			this.gameOver = true;
	// 			//call function for ui update
	// 			this.gameWinner =0;
	// 			return;
	// 		}
	// 		if(player1PtLR == this.winNumber){
	// 			// console.log('player 1 wins; triggered at diagonal win check');
	// 			this.gameOver = true;
	// 			this.gameWinner = 1;
	// 			return;
	// 		}
	// 	}
	// 	for(var i=0; i<this.dimension;){
	// 		var player0PtRL = 0;
	// 		var player1PtRL = 0;
	// 		for(var j=this.dimension-1; j>=0; j--){
	// 			var currentSquare2 = $('#'+i+j);
	// 			if(currentSquare2.hasClass('player0Sq')){
	// 				player0PtRL++;
	// 			}else{
	// 				player0PtRL = 0;
	// 			}
	// 			if(currentSquare2.hasClass('player1Sq')){
	// 				player1PtRL++;
	// 			}else{
	// 				player1PtRL = 0;
	// 			}
	// 			if(player0PtRL == this.winNumber){
	// 				// console.log('player 0 wins; triggered at diagonal win check');
	// 				this.gameOver = true;
	// 				//call function for ui update
	// 				this.gameWinner = 0;
	// 				return;
	// 			}
	// 			if(player1PtRL == this.winNumber){
	// 				// console.log('player 1 wins; triggered at diagonal win check');
	// 				this.gameOver = true;
	// 				this.gameWinner = 1;
	// 				return;
	// 			}
	// 			i++;
	// 		}
	// 	}
	// };
}