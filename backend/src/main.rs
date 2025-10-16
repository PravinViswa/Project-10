mod config;
mod api;
mod models;
mod services;
mod utils;

use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use api::game;
use api::player;
use services::storage::DynamoDbClient;
use std::env;
use aws_config;

#[actix_web::main]
async fn main()->std::io::Result<()>{
    dotenv::dotenv().ok();
    env::var("AWS_REGION").expect("AWS_REGION must be set in the .env file");

    let shared_config=aws_config::load_from_env().await;
    let db_client=aws_sdk_dynamodb::Client::new(&shared_config);
    let dynamo_service=DynamoDbClient::new(db_client);
    let dynamo_data=web::Data::new(dynamo_service);

    let host="0.0.0.0";
    let port=8080;
    println!("Server running at http://{}:{}",host,port);

    HttpServer::new(move||{
        let cors=Cors::default()
              .allowed_origin("http://localhost:3000")
              .allowed_methods(vec!["GET","POST"])
              .allow_any_header()
              .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(dynamo_data.clone()) 
            .configure(game::configure_routes)
            .service(
                web::scope("/player")
                    .route("/create",web::post().to(player::create_player))
            )
    })
    .bind((host,port))?
    .run()
    .await
}