
function Tictactoe(){
	const sign = {"X" : -1, "O" : 1};
	const grid_size = 3;
	const board_total_spots = grid_size * grid_size;
	const win_combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
	const first_player = 'X';
	const second_player = 'O';

	return {
		sign : sign,
		grid_size : grid_size,
		board_total_spots : board_total_spots,
		win_combos : win_combos,
		first_player : first_player,
		second_player : second_player
	};
}