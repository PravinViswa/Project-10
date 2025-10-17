mod api;
mod models;
mod services;
mod utils;

use actix_cors::Cors;
use actix_web::{middleware::Logger,web};
use api::{game,player};
use aws_config::meta::region::RegionProviderChain;
use aws_credential_types::Credentials;
use aws_sdk_dynamodb::Client;
use services::storage::DynamoDbClient;
use shuttle_actix_web::ShuttleActixWeb;
use shuttle_runtime::SecretStore;
use aws_types::region::Region;
use actix_web::http::header;

fn app_config(cfg:&mut web::ServiceConfig){
    let cors = Cors::default()
        .allowed_origin("https://pravinviswa.github.io")
        .allowed_origin("http://localhost:3000")
        .allowed_methods(vec!["GET","POST","OPTIONS"])
        .allow_any_header()
        .supports_credentials()
        .max_age(3600);
    cfg.service(
        web::scope("/")
            .wrap(cors)
            .wrap(Logger::default())
            .configure(player::configure_routes)
            .configure(game::configure_routes),
    );
}

#[shuttle_runtime::main(instance_size="s")]
async fn actix_web(
    #[shuttle_runtime::Secrets] secrets:SecretStore,
) -> ShuttleActixWeb<impl FnOnce(&mut web::ServiceConfig)+Send+Clone+'static>{
    let aws_region=secrets.get("AWS_REGION").expect("AWS_REGION must be set");
    let aws_access_key_id=secrets
        .get("AWS_ACCESS_KEY_ID")
        .expect("AWS_ACCESS_KEY_ID must be set");
    let aws_secret_access_key=secrets
        .get("AWS_SECRET_ACCESS_KEY")
        .expect("AWS_SECRET_ACCESS_KEY must be set");
    let credentials=Credentials::new(
        aws_access_key_id,
        aws_secret_access_key,
        None, 
        None, 
        "shuttle-provider",
    );
    let region=Region::new(aws_region);
    let region_provider=RegionProviderChain::first_try(region);
    let shared_config=aws_config::defaults(aws_config::BehaviorVersion::latest())
        .region(region_provider)
        .credentials_provider(credentials)
        .load()
        .await;

    let db_client=Client::new(&shared_config);
    
    let table_name="2048Game".to_string(); 
    let dynamo_service=DynamoDbClient::new(db_client, table_name);
    let dynamo_data=web::Data::new(dynamo_service);
    let config=move|cfg:&mut web::ServiceConfig|{
        cfg.app_data(dynamo_data.clone()).configure(app_config);
    };

    Ok(config.into())
}