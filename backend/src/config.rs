use std::env;
pub fn get_dynamo_table()->String{
    env::var("DYNAMO_TABLE_NAME").expect("DYNAMO_TABLE_NAME must be set")
}