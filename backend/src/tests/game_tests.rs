#[cfg(test)]
mod tests{
    use crate::models::game_state::GameState;
    use crate::utils::helpers::{add_random_tile, move_core_game};

    #[test]
    fn test_add_tile_logic(){
        let initial_board=vec![vec![0;4];4];
        let new_board=add_random_tile(&initial_board);
        let count=new_board.iter().flatten().filter(|&&x|x!=0).count();
        assert_eq!(count,1);
    }

    #[test]
    fn test_move_left_logic(){
        let initial_board=vec![
            vec![2,2,0,0],
            vec![2,0,2,0],
            vec![4,4,8,8],
            vec![2,4,8,16],
        ];

        let (new_board_1,score_1,changed_1)=move_core_game(&initial_board,4,"left");
        assert_eq!(new_board_1[0],vec![4,0,0,0]);
        assert!(changed_1);

        assert_eq!(new_board_1[1],vec![4,0,0,0]);

        assert_eq!(new_board_1[2],vec![8,16,0,0]);

        assert_eq!(new_board_1[3],vec![2,4,8,16]);
    }

    #[test]
    fn test_move_right_logic(){
        let initial_board = vec![
            vec![0,0,2,2],
            vec![2,4,4,2],
            vec![0,0,0,0],
            vec![0,2,4,4],
        ];

        let (new_board,_,_)=move_core_game(&initial_board,4,"right");
        assert_eq!(new_board[0],vec![0,0,0,4]);

        assert_eq!(new_board[1],vec![2,8,2,0]);

        assert_eq!(new_board[1],vec![0,2,8,2]);

        assert_eq!(new_board[2],vec![0,0,0,0]);
    }

}