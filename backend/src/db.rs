use rusqlite::Connection;
use std::sync::Arc;
use tokio::sync::Mutex;

pub type Db = Arc<Mutex<Connection>>;

pub fn init_db(path: &str) -> Db {
    let conn = Connection::open(path).expect("Failed to open database");
    conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")
        .expect("Failed to set pragmas");

    let schema = include_str!("schema.sql");
    conn.execute_batch(schema).expect("Failed to initialize schema");

    Arc::new(Mutex::new(conn))
}
