use aws_sdk_dynamodb::types::AttributeValue;
use aws_sdk_dynamodb::Client;
use serde_json::to_string;

use crate::models::game_state::GameState;
pub struct DynamoDbClient{
    client:Client,
    table_name:String,
}

impl DynamoDbClient{
    pub fn new(client:Client,table_name:String)->Self{
        DynamoDbClient{
            client,
            table_name,
        }
    }

    pub async fn save_game(&self,game:&GameState)->Result<(),String>{
        let game_json=match to_string(game){
            Ok(j)=>j,
            Err(e)=>return Err(format!("Failed to serialize game state:{}",e)),
        };

        match self
            .client
            .put_item()
            .table_name(&self.table_name)
            .item("player_id",AttributeValue::S(game.player_id.clone()))
            .item("game_data",AttributeValue::S(game_json))
            .send()
            .await
        {
            Ok(_)=>Ok(()),
            Err(e)=>Err(format!("DynamoDB put_item error:{}",e.to_string())),
        }
    }

    pub async fn load_game(&self,player_id:&str)->Result<Option<GameState>,String>{
        let response=match self
            .client
            .get_item()
            .table_name(&self.table_name)
            .key("player_id", AttributeValue::S(player_id.to_string()))
            .send()
            .await
        {
            Ok(resp)=>resp,
            Err(e)=>return Err(format!("DynamoDB get_item error:{}",e.to_string())),
        };

        match response.item{
            Some(item)=>{
                let game_data_attr = item
                    .get("game_data")
                    .ok_or_else(||"Missing 'game_data' attribute".to_string())?;

                let game_json=game_data_attr
                    .as_s()
                    .map_err(|_|"Failed to get string from AttributeValue".to_string())?;

                let game_state: GameState=serde_json::from_str(game_json)
                    .map_err(|e|format!("Failed to deserialize GameState:{}",e))?;

                Ok(Some(game_state))
            }
            None=>Ok(None),
        }
    }
}