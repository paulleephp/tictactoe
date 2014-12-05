function Game() {

    var current_turn = null,
        board = null,
        tictactoe = null,
        max_value = 100
    var player1 = new Object(),
        player2 = new Object();

    function init(first_player_type, second_player_type) {
        tictactoe = new Tictactoe();
        board = new Object();
        current_turn = tictactoe.first_player;

        player1.type = first_player_type;
        player2.type = second_player_type;
    }

    function toggleTurn() {
        current_turn = (current_turn === tictactoe.first_player) ? tictactoe.second_player : tictactoe.first_player;
    }

    /**
     * general move function that is used for human vs human, human vs bot games.
     **/
    function move(index, callback) {
        var first_move, second_move, final_winner, is_tie;
        board[index] = current_turn;
        first_move = current_turn;
        toggleTurn();

        if (current_turn === tictactoe.second_player && player2.type === 'bot') {
            var move_bot_made = bot_move();
            second_move = current_turn;
            toggleTurn();
        }
        else if (current_turn === tictactoe.first_player && player1.type === 'bot') {
            var move_bot_made = bot_move();
            second_move = current_turn;
            toggleTurn();
        }

        getGameWinner(function (winner) {
            if (winner === tictactoe.first_player) {
                final_winner = tictactoe.first_player;
            }
            if (winner === tictactoe.second_player) {
                final_winner = tictactoe.second_player;
            }
        });

        if (callback) {
            callback(first_move, move_bot_made, second_move, final_winner, isTie());
        }
    }

    /**
     * makes move for bot with the best move calculated from negamax
     * function
     **/
    function bot_move() {
        /**
         * pass player(second parameter) as 1 if player 1 is bot and -1 if player 2 is bot
         * to have minimax function find solution correctly. 
         */
        var player_param = (player1.type === 'bot') ? 1 : -1;
        var best_move = negamax(0, player_param, -max_value, max_value);

        board[best_move] = current_turn;
        return best_move;
    }

    /**
     * initial move for bot vs human game to let the game utilize move 
     * function
     **/
    function letBotMoveProceed(callback) {
        if ((current_turn === tictactoe.first_player) && (player1.type === 'bot')) {
            var move_made = bot_move();
            callback(current_turn, move_made)
            toggleTurn();
        }
    }

    /**
     * Recursive function used by ai player to compute best move
     **/
    function negamax(depth, player, alpha, beta) {
        var max, next, alternate;
        var min = -max_value;

        // 0 is returned at the end if tie. 
        var value = checkIfGameOver(depth);
        if (value !== undefined) {
            return player * value;
        }

        // For all legal moves
        for (var move_made = 0; move_made < 9; move_made++) {
            if (board[move_made] !== undefined) {
                continue;
            }

            // Instead of making a copy and finding out the score, just do a trick of setting then unsetting the move.
            board[move_made] = (player === 1) ? tictactoe.first_player : tictactoe.second_player;
            alternate = -negamax(depth + 1, -player, -beta, -alpha);
            board[move_made] = undefined;

            if (max === undefined || alternate > max) {
                max = alternate;
            }
            if (alternate > alpha) {
                alpha = alternate;
            }
            // pruning
            if (alpha >= beta) {
                return alpha;
            }
            if (max > min) {
                min = max;
                next = move_made;
            }
        }

        if (depth > 0) {
            return max || 0;
        }
        if (depth === 0) {
            return next;
        }
    }

    /**
     * use depth parameter to figure out shorter winning moves
     */
    function checkIfGameOver(depth) {

        for (var i = 0; i < tictactoe.win_combos.length; i++) {
            if (isWin(i, tictactoe.first_player)) {
                return max_value - depth;
            }
            if (isWin(i, tictactoe.second_player)) {
                return depth - max_value;
            }
        }
    }

    /**
     * Loops throught all possible winning combinations to see if there is winner in the game
     **/
    function getGameWinner(callback) {
        var winner;
        for (var i = 0; i < tictactoe.win_combos.length; i++) {
            if (isWin(i, tictactoe.first_player)) {
                winner = tictactoe.first_player;
            }
            if (isWin(i, tictactoe.second_player)) {
                winner = tictactoe.second_player;
            }
        }
        callback(winner);
    }

    function isWin(index, player) {
        return (
            board[tictactoe.win_combos[index][0]] === player &&
            board[tictactoe.win_combos[index][1]] === player &&
            board[tictactoe.win_combos[index][2]] === player
            );
    }

    /**
     * checks to see if the game is tie.
     **/
    function isTie() {
        for (var i = 0; i < tictactoe.board_total_spots; i++) {
            if (board[i] === undefined) {
                return 0;
            }
        }
        return 1;
    }

    return{
        init: init,
        move: move,
        letBotMoveProceed: letBotMoveProceed,
        // botVSBot: botVSBot
    };
}
