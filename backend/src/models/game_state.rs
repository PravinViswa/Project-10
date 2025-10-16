use serde::{Serialize,Deserialize};

#[derive(Serialize,Deserialize,Debug,Clone)]
pub struct GameState{
    pub player_id:String,
    pub passcode:String,
    pub board:Vec<Vec<u32>>,
    pub score:u32,
    pub best_score:u32,
    pub is_game_over:bool,
    pub is_game_won:bool,
    pub grid_width:usize,
    pub grid_height:usize,
}

impl GameState{
    pub fn new(player_id:String,passcode:String,grid_width:usize,grid_height:usize)->Self{
        GameState{
            player_id,
            passcode,
            board:vec![vec![0;grid_width];grid_height],
            score:0,
            best_score:0,
            is_game_over:false,
            is_game_won:false,
            grid_width,
            grid_height,
        }
    }
}