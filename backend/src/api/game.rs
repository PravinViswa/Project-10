use actix_web::{web,HttpResponse,Responder};
use serde::Deserialize;

use crate::models::game_state::GameState;
use crate::utils::helpers::{add_random_tile,check_game_status,move_core_game};
use crate::services::storage::DynamoDbClient; 

#[derive(Deserialize)]
struct GameRequest{
    player_id:String,
    #[serde(default)]
    passcode:String,
    #[serde(default="default_grid_dimension")]
    grid_width:usize,
    #[serde(default="default_grid_dimension")]
    grid_height:usize,
}

fn default_grid_dimension()->usize{4}

pub fn configure_routes(cfg:&mut web::ServiceConfig){
    cfg.service(
        web::scope("/game")
            .route("/health", web::get().to(get_health_check))
            .route("/start", web::post().to(start_game))
            .route("/restart", web::post().to(restart_game))
            .route("/move-left", web::post().to(move_left))
            .route("/move-right", web::post().to(move_right))
            .route("/move-up", web::post().to(move_up))
            .route("/move-down", web::post().to(move_down))
    );
}

async fn start_game(
    info: web::Json<GameRequest>,
    db_client: web::Data<DynamoDbClient>,
) -> impl Responder{
    let player_id=&info.player_id;
    let passcode=&info.passcode;

    match db_client.load_game(player_id).await{
        Ok(Some(game))=>{
            if game.passcode==*passcode {
                HttpResponse::Ok().json(game)
            }else{
                HttpResponse::Unauthorized().body("Incorrect passcode.")
            }
        }
        Ok(None)=>HttpResponse::NotFound().body("Player ID not found."),
        Err(e)=>HttpResponse::InternalServerError().body(format!("DB Load Error:{}",e)),
    }
}

async fn restart_game(
    info: web::Json<GameRequest>,
    db_client: web::Data<DynamoDbClient>,
) -> impl Responder{
    let player_id=info.player_id.clone();
    
    let existing_game=match db_client.load_game(&player_id).await{
        Ok(Some(game)) if game.passcode==info.passcode => game,
        Ok(_)=>return HttpResponse::Unauthorized().body("Authentication failed."),
        Err(e)=>return HttpResponse::InternalServerError().body(format!("DB error:{}",e)),
    };

    let mut new_game=GameState::new(
        player_id, 
        info.passcode.clone(),
        info.grid_width,
        info.grid_height
    );
    new_game.best_score=existing_game.best_score;

    let board_with_first_tile=add_random_tile(&new_game.board);
    new_game.board=add_random_tile(&board_with_first_tile);

    if let Err(e)=db_client.save_game(&new_game).await{
        return HttpResponse::InternalServerError().body(format!("DB Save Error:{}",e));
    }
    HttpResponse::Ok().json(new_game)
}

async fn handle_move(
    direction:&str, 
    info:web::Json<GameRequest>,
    db_client:web::Data<DynamoDbClient>,
)->impl Responder{
    let mut game=match db_client.load_game(&info.player_id).await{
        Ok(Some(g)) if g.passcode==info.passcode=>g,
        Ok(_)=>return HttpResponse::Unauthorized().body("Authentication failed."),
        Err(e)=>return HttpResponse::InternalServerError().body(format!("DB Load Error:{}",e)),
    };

    if game.is_game_over{return HttpResponse::Forbidden().body("Game is already over.");}
    
    let (new_board,score_earned,changed)=move_core_game(&game.board,game.grid_width,game.grid_height,direction);
    
    if !changed {return HttpResponse::Ok().json(game);}

    game.board=add_random_tile(&new_board);
    game.score+=score_earned;
    if game.score>game.best_score{game.best_score=game.score;}

    let (is_won,is_lost)=check_game_status(&game.board);
    game.is_game_won=is_won;
    game.is_game_over=is_lost;

    if let Err(e)=db_client.save_game(&game).await{
        return HttpResponse::InternalServerError().body(format!("DB Save Error:{}",e));
    }
    HttpResponse::Ok().json(game)
}

async fn get_health_check()->impl Responder{HttpResponse::Ok().body("API Status: OK")}
async fn move_left(info:web::Json<GameRequest>,db_client:web::Data<DynamoDbClient>)->impl Responder{handle_move("left",info,db_client).await}
async fn move_right(info:web::Json<GameRequest>,db_client:web::Data<DynamoDbClient>)->impl Responder{handle_move("right",info,db_client).await}
async fn move_up(info:web::Json<GameRequest>,db_client:web::Data<DynamoDbClient>)->impl Responder{handle_move("up",info,db_client).await}
async fn move_down(info:web::Json<GameRequest>,db_client:web::Data<DynamoDbClient>)->impl Responder{handle_move("down",info,db_client).await}