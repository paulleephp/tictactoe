function Game(){

	var current_turn = null;
	var board = null;
	var tictactoe = null;
	var player1 = new Object();
	var player2 = new Object();

	function init(first_player_type, second_player_type){
		tictactoe = new Tictactoe();
		board = new Object();
		current_turn = tictactoe.first_player;

		player1.type = first_player_type;
		player2.type = second_player_type;
	}

	function toggleTurn(){
        current_turn = (current_turn == tictactoe.first_player) ? tictactoe.second_player : tictactoe.first_player;
    }

    /**
     * general move function that is used for human vs human, human vs bot games.
     **/
    function move(index, callback){
    	var first_move, second_move, final_winner, is_tie;
    	board[index] = current_turn;
    	first_move = current_turn;
        toggleTurn();

        if(current_turn == tictactoe.second_player && player2.type == 'bot'){
            var move_bot_made = bot_move(tictactoe.second_player);
            second_move = current_turn;
            toggleTurn();
        }
        else if(current_turn == tictactoe.first_player && player1.type == 'bot'){
            var move_bot_made = bot_move(tictactoe.first_player);
            second_move = current_turn;
            toggleTurn();
        }

        getGameWinner(function(winner){
        	if(winner == tictactoe.first_player){
        		final_winner = tictactoe.first_player;
        	}
        	if(winner == tictactoe.second_player){
        		final_winner = tictactoe.second_player;
        	}
        });

        if(callback){
    		callback(first_move, move_bot_made, second_move, final_winner, isTie());
    	}
    }

    /**
     * makes move for bot with the best move calculated from negamax
     * function
     **/
    function bot_move(player){
		var best_move = negamax(player, -2, 2);
        board[best_move.move] = current_turn;
        return best_move.move;
    }
    
    /**
     * initial move for bot vs human game to let the game utilize move 
     * function
     **/ 
    function letBotMoveProceed(callback){
		if( (current_turn == tictactoe.first_player) && (player1.type == 'bot')){
			var move_made = bot_move(tictactoe.first_player);
			callback(current_turn, move_made)
			toggleTurn();
		}
    }

    /**
     * lets bot vs bot game proceed in while loop, while updating ui.
     **/
    function botVSBot(callback){
    	var winner, is_tie;
    	while(!winner && !is_tie){
    		if( (current_turn == tictactoe.first_player) ){
				var move_made = bot_move(tictactoe.first_player);
				callback(current_turn, move_made, winner, is_tie);
				toggleTurn();
			}

			if( (current_turn == tictactoe.second_player) ){
				var move_made = bot_move(tictactoe.second_player);
				callback(current_turn, move_made, winner, is_tie);
				toggleTurn();
			}

    		getGameWinner(function(winner){
	        	if(winner == tictactoe.first_player){
	        		final_winner = tictactoe.first_player;
	        	}
	        	if(winner == tictactoe.second_player){
	        		final_winner = tictactoe.second_player;
	        	}
	        });
    		is_tie = isTie();
    	}
    }

    /**
     * Recursive function used by ai player to compute best move
     **/
    function negamax(turn, alpha, beta){
        var max = new Object();

        //
        for (var i = 0; i < tictactoe.win_combos.length; i++) {
            if (board[tictactoe.win_combos[i][0]] == tictactoe.first_player && 
                board[tictactoe.win_combos[i][1]] == tictactoe.first_player && 
                board[tictactoe.win_combos[i][2]] == tictactoe.first_player) {
                max.score = -1;
        		return max;
            }
            if (board[tictactoe.win_combos[i][0]] == tictactoe.second_player && 
                board[tictactoe.win_combos[i][1]] == tictactoe.second_player && 
                board[tictactoe.win_combos[i][2]] == tictactoe.second_player) {
                max.score = 1;
        		return max;
            }
        }
        
        if (isTie()){
            max.score = 0;
            return max;
        }

        if (turn == tictactoe.second_player){
            max.score = alpha;
        }
        if (turn == tictactoe.first_player){
            max.score = beta;
        }

        // For all legal moves
        for (var move_made = 0; move_made < 9; move_made++){
            if (board[move_made] != undefined){
                continue;
            }

            // Instead of making a copy and finding out the score, just do a trick of setting then unsetting the move.
            var new_turn = turn == tictactoe.second_player ? tictactoe.first_player : tictactoe.second_player;
            board[move_made] = turn;
            var alternate = negamax(new_turn, -beta, -alpha);
            board[move_made] = undefined;

            if (turn == tictactoe.second_player && alternate.score > max.score){
                max.move = move_made;
                max.score = alternate.score;
                alpha = alternate.score;
            }            
            else if (turn == tictactoe.first_player && alternate.score < max.score){
                max.move = move_made;
                max.score = alternate.score;
                beta = alternate.score;
            }
            if (alpha >= beta){
                return max;
            }
        }
        return max;
    }

    /**
     * Loops throught all possible winning combinations to see if there is winner in the game
     **/
    function getGameWinner(callback){
    	var winner;
    	for (var i = 0; i < tictactoe.win_combos.length; i++) {
            if (board[tictactoe.win_combos[i][0]] == tictactoe.first_player && 
                board[tictactoe.win_combos[i][1]] == tictactoe.first_player && 
                board[tictactoe.win_combos[i][2]] == tictactoe.first_player) {
                winner = tictactoe.first_player;
            }
            if (board[tictactoe.win_combos[i][0]] == tictactoe.second_player && 
                board[tictactoe.win_combos[i][1]] == tictactoe.second_player && 
                board[tictactoe.win_combos[i][2]] == tictactoe.second_player) {
                winner = tictactoe.second_player;
            }
        }
        callback(winner);
    }

    /**
     * checks to see if the game is tie.
     **/
    function isTie(){
        for (var i = 0; i < tictactoe.board_total_spots; i++){
            if (board[i] == undefined){
                return 0;
            }
        }
        return 1;
    }

	return{
		init : init,
		move : move,
		letBotMoveProceed : letBotMoveProceed,
		botVSBot : botVSBot
	};
}
