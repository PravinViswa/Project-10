use actix_web::{web,HttpResponse,Responder};
use serde::Deserialize;

use crate::models::game_state::GameState;
use crate::services::storage::DynamoDbClient;
use crate::utils::helpers::add_random_tile;

#[derive(Deserialize)]
pub struct CreatePlayerRequest{
    player_id: String,
    passcode: String,
    #[serde(default="default_grid_dimension")]
    grid_width:usize,
    #[serde(default="default_grid_dimension")]
    grid_height:usize,
}

fn default_grid_dimension()->usize{4}

pub async fn create_player(
    info:web::Json<CreatePlayerRequest>,
    db_client:web::Data<DynamoDbClient>,
)->impl Responder{
    let player_id=info.player_id.clone();

    match db_client.load_game(&player_id).await{
        Ok(Some(_))=>{
            return HttpResponse::Conflict().body("Player ID already exists. Please choose a different ID.");
        }
        Ok(None)=>{},
        Err(e)=>return HttpResponse::InternalServerError().body(format!("Database error:{}",e)),
    }
    
    let mut new_game=GameState::new(
        player_id, 
        info.passcode.clone(),
        info.grid_width,
        info.grid_height
    );

    let board_with_first_tile=add_random_tile(&new_game.board);
    new_game.board=add_random_tile(&board_with_first_tile);

    match db_client.save_game(&new_game).await{
        Ok(_)=>HttpResponse::Created().json(new_game),
        Err(e)=>HttpResponse::InternalServerError().body(format!("Failed to save new player:{}",e)),
    }
}