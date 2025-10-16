mod api;
mod config;
mod models;
mod services;
mod utils;

use actix_cors::Cors;
use actix_web::{middleware::Logger,web,App,HttpServer};
use api::{game, player};
use aws_config;
use services::storage::DynamoDbClient;
use shuttle_actix_web::ShuttleActixWeb;
use shuttle_runtime::SecretStore;
use std::sync::{Arc,Mutex};

fn app_config(cfg:&mut web::ServiceConfig){
    let cors=Cors::default()
        .allowed_origin("https://PravinViswa.github.io")
        .allowed_origin("http://localhost:3000")
        .allow_any_header()
        .max_age(3600);                                      

    cfg.service(
        web::scope("")
            .wrap(cors)
            .wrap(Logger::default())
            .configure(player::configure_routes)
            .configure(game::configure_routes),
    );
}

//Shuttle's main macro
#[shuttle_runtime::main]
async fn actix_web(
    #[shuttle_runtime::Secrets] secrets:SecretStore,
)->ShuttleActixWeb<impl FnOnce(&mut web::ServiceConfig)+Send+Clone+'static>{
    
    //To Load secrets from Shuttle's secret store
    let aws_region=secrets.get("AWS_REGION").expect("AWS_REGION must be set");
    let aws_access_key_id=secrets.get("AWS_ACCESS_KEY_ID").expect("AWS_ACCESS_KEY_ID must be set");
    let aws_secret_access_key= secrets.get("AWS_SECRET_ACCESS_KEY").expect("AWS_SECRET_ACCESS_KEY must be set");

    //Set environment variables for the AWS SDK to use
    std::env::set_var("AWS_REGION",aws_region);
    std::env::set_var("AWS_ACCESS_KEY_ID",aws_access_key_id);
    std::env::set_var("AWS_SECRET_ACCESS_KEY",aws_secret_access_key);
    
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let shared_config=aws_config::load_defaults(aws_config::BehaviorVersion::latest()).await;
    let db_client=aws_sdk_dynamodb::Client::new(&shared_config);
    let dynamo_service=DynamoDbClient::new(db_client);
    let dynamo_data=web::Data::new(dynamo_service);

    let config=move|cfg:&mut web::ServiceConfig|{
        cfg.app_data(dynamo_data.clone()).configure(app_config);
    };

    Ok(config.into())
}