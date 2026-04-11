#[tokio::main]
async fn main() {
    let db_path = std::env::var("DATABASE_PATH").ok();
    let static_dir = std::env::var("STATIC_DIR").ok();
    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(budget_overview_backend::DEFAULT_PORT);

    budget_overview_backend::start_server(port, db_path, static_dir).await;
}

