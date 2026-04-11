use tauri::Manager;

/// Resolve the database path. Respects DATABASE_PATH env var (Docker compat),
/// then falls back to %APPDATA%/Budget Overview/budget.db (or platform equivalent).
fn resolve_db_path() -> String {
    if let Ok(path) = std::env::var("DATABASE_PATH") {
        return path;
    }

    if let Some(base_dirs) = directories::BaseDirs::new() {
        let app_data = base_dirs.data_dir().join("Budget Overview");
        if let Err(e) = std::fs::create_dir_all(&app_data) {
            eprintln!("Warning: could not create app data dir: {e}");
        }
        return app_data.join("budget.db").to_string_lossy().into_owned();
    }

    // Last-resort fallback
    "budget.db".to_string()
}

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let db_path = resolve_db_path();

            // Bundle resources (frontend dist) are placed under www/ inside resource_dir.
            // The Axum backend uses STATIC_DIR to serve them.
            let static_dir: Option<String> = app
                .path()
                .resource_dir()
                .ok()
                .map(|p| p.join("www"))
                .filter(|p| p.is_dir())
                .map(|p| p.to_string_lossy().into_owned());

            // Start backend in a background async task
            tauri::async_runtime::spawn(async move {
                println!("Starting backend...");
                budget_overview_backend::start_server(3001, Some(db_path), static_dir).await;
            });

            // Show window only after backend is ready (avoid blank flash)
            let window = app.get_webview_window("main").unwrap();
            tauri::async_runtime::spawn(async move {
                println!("Waiting for backend...");
                let client = reqwest::Client::new();
                for attempt in 1..=30 {
                    match client
                        .get("http://127.0.0.1:3001/health")
                        .send()
                        .await
                    {
                        Ok(resp) if resp.status().is_success() => {
                            println!("Backend ready after {attempt} attempt(s)");
                            break;
                        }
                        Ok(resp) => println!("Health check attempt {attempt}: HTTP {}", resp.status()),
                        Err(e) => println!("Health check attempt {attempt}: {e}"),
                    }
                    tokio::time::sleep(std::time::Duration::from_millis(250)).await;
                }
                println!("Showing window");
                let _ = window.show();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
