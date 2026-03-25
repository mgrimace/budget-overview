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

    // Migrations for existing databases
    conn.execute_batch(
        "ALTER TABLE budget_item_tags ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0"
    ).ok();
    conn.execute_batch(
        "ALTER TABLE budget_items ADD COLUMN primary_tag TEXT NOT NULL DEFAULT 'Uncategorized'"
    ).ok();
    // 1) Set primary_tag when exactly one tag exists for the item.
    conn.execute_batch("
        UPDATE budget_items
        SET primary_tag = (
            SELECT t.name FROM tags t
            JOIN budget_item_tags bt ON t.id = bt.tag_id
            WHERE bt.budget_item_id = budget_items.id
            LIMIT 1
        )
        WHERE (primary_tag IS NULL OR primary_tag = '' OR primary_tag = 'Uncategorized')
        AND (
            SELECT COUNT(*) FROM budget_item_tags WHERE budget_item_id = budget_items.id
        ) = 1
    ").ok();

    // 2) Set primary_tag from first tag (by tag_id) for items with multiple tags.
    conn.execute_batch("
        UPDATE budget_items
        SET primary_tag = (
            SELECT t.name FROM tags t
            JOIN budget_item_tags bt ON t.id = bt.tag_id
            WHERE bt.budget_item_id = budget_items.id
            ORDER BY bt.tag_id ASC LIMIT 1
        )
        WHERE (primary_tag IS NULL OR primary_tag = '' OR primary_tag = 'Uncategorized')
        AND (
            SELECT COUNT(*) FROM budget_item_tags WHERE budget_item_id = budget_items.id
        ) > 1
    ").ok();

    // 3) Set Uncategorized for no tags.
    conn.execute_batch("UPDATE budget_items SET primary_tag = 'Uncategorized' WHERE primary_tag IS NULL OR primary_tag = '' OR primary_tag = 'Uncategorized'").ok();

    Arc::new(Mutex::new(conn))
}
