use rusqlite::Connection;
use std::{fs, path::{Path, PathBuf}, sync::Arc};
use tokio::sync::Mutex;

pub const DEFAULT_DB_PATH: &str = "data/budget.db";
pub const SNAPSHOT_DIR: &str = "data/snapshots";

pub struct DbState {
    active_db_path: Mutex<PathBuf>,
    default_db_path: PathBuf,
}

pub type Db = Arc<DbState>;

impl DbState {
    pub async fn active_db_path(&self) -> PathBuf {
        self.active_db_path.lock().await.clone()
    }

    pub async fn set_active_db_path(&self, path: PathBuf) {
        let mut current = self.active_db_path.lock().await;
        *current = path;
    }

    pub async fn reset_active_db_path(&self) {
        let mut current = self.active_db_path.lock().await;
        *current = self.default_db_path.clone();
    }

    pub async fn is_default_path(&self) -> bool {
        let current = self.active_db_path.lock().await;
        *current == self.default_db_path
    }

    pub async fn get_connection(&self) -> rusqlite::Result<Connection> {
        let path = self.active_db_path().await;
        let conn = Connection::open(path)?;
        conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
        Ok(conn)
    }
}

fn initialize_schema(conn: &Connection) {
    conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;").expect("Failed to set pragmas");
    let schema = include_str!("schema.sql");
    conn.execute_batch(schema).expect("Failed to initialize schema");
    conn.execute_batch(
        "ALTER TABLE budget_item_tags ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0",
    )
    .ok();
    conn.execute_batch(
        "ALTER TABLE budget_items ADD COLUMN primary_tag TEXT NOT NULL DEFAULT 'Uncategorized'",
    )
    .ok();
    conn.execute_batch(
        "ALTER TABLE budget_items ADD COLUMN visible INTEGER NOT NULL DEFAULT 1",
    )
    .ok();
    conn.execute_batch(
        "UPDATE budget_items
        SET primary_tag = (
            SELECT t.name FROM tags t
            JOIN budget_item_tags bt ON t.id = bt.tag_id
            WHERE bt.budget_item_id = budget_items.id
            LIMIT 1
        )
        WHERE (primary_tag IS NULL OR primary_tag = '' OR primary_tag = 'Uncategorized')
        AND (
            SELECT COUNT(*) FROM budget_item_tags WHERE budget_item_id = budget_items.id
        ) = 1",
    )
    .ok();
    conn.execute_batch(
        "UPDATE budget_items
        SET primary_tag = (
            SELECT t.name FROM tags t
            JOIN budget_item_tags bt ON t.id = bt.tag_id
            WHERE bt.budget_item_id = budget_items.id
            ORDER BY bt.tag_id ASC LIMIT 1
        )
        WHERE (primary_tag IS NULL OR primary_tag = '' OR primary_tag = 'Uncategorized')
        AND (
            SELECT COUNT(*) FROM budget_item_tags WHERE budget_item_id = budget_items.id
        ) > 1",
    )
    .ok();
    conn.execute_batch(
        "UPDATE budget_items SET primary_tag = 'Uncategorized' WHERE primary_tag IS NULL OR primary_tag = '' OR primary_tag = 'Uncategorized'",
    )
    .ok();
}

pub fn init_db(path: Option<&str>) -> Db {
    let db_path = path.unwrap_or(DEFAULT_DB_PATH);
    let db_dir = Path::new(db_path).parent().unwrap_or_else(|| Path::new("data"));
    fs::create_dir_all(db_dir).expect("Failed to create data directory");
    fs::create_dir_all(SNAPSHOT_DIR).expect("Failed to create snapshots directory");

    let conn = Connection::open(db_path).expect("Failed to open database");
    initialize_schema(&conn);

    let default_db_path = fs::canonicalize(db_path).unwrap_or_else(|_| PathBuf::from(db_path));

    Arc::new(DbState {
        active_db_path: Mutex::new(default_db_path.clone()),
        default_db_path,
    })
}

