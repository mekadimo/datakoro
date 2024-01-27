use tokio;

mod config;

use crate::config::server::start_server;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    start_server().await;
    Ok(())
}
