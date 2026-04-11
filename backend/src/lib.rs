pub mod db;
mod handlers;
mod models;

use axum::{
    routing::{get, put},
    Router,
};
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::{ServeDir, ServeFile};

pub const DEFAULT_PORT: u16 = 3001;

pub async fn start_server(port: u16, db_path: Option<String>, static_dir: Option<String>) {
    let db_path = db_path.unwrap_or_else(|| db::DEFAULT_DB_PATH.to_string());
    let db = db::init_db(&db_path);

    let static_dir = static_dir.unwrap_or_else(|| "../frontend/dist".to_string());

    let app = Router::new()
        .route(
            "/api/budget-items",
            get(handlers::list_budget_items).post(handlers::create_budget_item),
        )
        .route(
            "/api/budget-items/:id",
            get(handlers::get_budget_item)
                .put(handlers::update_budget_item)
                .delete(handlers::delete_budget_item),
        )
        .route(
            "/api/budget-items/:id/primary-tag",
            axum::routing::patch(handlers::update_budget_item_primary_tag),
        )
        .route(
            "/api/budget-items/:id/visibility",
            axum::routing::patch(handlers::update_budget_item_visibility),
        )
        .route(
            "/api/tags",
            get(handlers::list_tags).post(handlers::create_tag),
        )
        .route(
            "/api/tags/:id",
            put(handlers::rename_tag).delete(handlers::delete_tag),
        )
        .route("/api/cashflow", get(handlers::get_cashflow))
        .route("/api/upcoming-bills", get(handlers::get_upcoming_bills))
        .route("/api/snapshots", get(handlers::list_snapshots).post(handlers::create_snapshot))
        .route("/api/snapshots/:filename", axum::routing::delete(handlers::delete_snapshot).put(handlers::rename_snapshot))
        .route("/api/snapshots/activate", axum::routing::post(handlers::activate_snapshot))
        .route("/api/snapshots/reset", axum::routing::post(handlers::reset_snapshot))
        .route("/api/snapshots/active", get(handlers::get_active_snapshot))
        .with_state(db)
        .fallback_service(
            ServeDir::new(&static_dir)
                .not_found_service(ServeFile::new(format!("{}/index.html", static_dir))),
        )
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
