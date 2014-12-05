$(document).ready(function() {

    var game = null
    var playerX = null;
    var playerO = null;
    init();

    function init(){
        playerX = $('#X :selected').data('type');
        playerO = $('#O :selected').data('type');

        if(playerX =='bot' && playerO == 'bot'){
            disableButtons();
            $('#message').text('Game Mode not Supported');
            alert('Bot vs Bot mode not enabled. Please choose at least 1 human player.');
        }

        game = new Game();
        game.init(playerX, playerO);

        if(playerX == 'bot' && playerO == 'human'){
            game.letBotMoveProceed(function(current_turn, index){
                updateDisplay(current_turn, index);
            });
        }
    }

    function initDisplay(){
        $('ul#grid > li').text('');
        $('ul#grid > li').removeClass('disabled');
        $('#message').text('Game in Progress');
        $('#start').text('Restart');
    }

    function updateDisplay(current_turn, index){
        $('#js_' + index).text(current_turn);
        $('#js_' + index).addClass('disabled');
    }

    function disableButtons(){
        $('ul#grid > li').addClass('disabled');
    }

    $('#start').click(function(){
        initDisplay();
        init();
    });

    $('ul#grid > li').click(function(){
        if(!$(this).hasClass('disabled')){
            move($(this).data('index'));
        }
    });

    function move(index){
        game.move(index, function(current_turn, second_move_index, second_move_turn, final_winner, is_tie){
            updateDisplay(current_turn, index);

            if(second_move_index != undefined){
                updateDisplay(second_move_turn, second_move_index);
            }

            if(final_winner != undefined){
                //end the game
                $('#message').text('Player ' +final_winner + ' has won!');
                disableButtons();
            }

            if(is_tie != undefined && is_tie){
                $('#message').text('Tie!');
                disableButtons();
            }

        });
    }

});
