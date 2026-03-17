CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS budget_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    item_type TEXT NOT NULL CHECK(item_type IN ('income', 'expense')),
    frequency TEXT NOT NULL CHECK(frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly')),
    day_of_month INTEGER,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS budget_item_tags (
    budget_item_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (budget_item_id, tag_id),
    FOREIGN KEY (budget_item_id) REFERENCES budget_items(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS variable_amounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    budget_item_id INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK(month >= 1 AND month <= 12),
    amount REAL NOT NULL,
    FOREIGN KEY (budget_item_id) REFERENCES budget_items(id) ON DELETE CASCADE,
    UNIQUE(budget_item_id, month)
);

-- Seed default tags
INSERT OR IGNORE INTO tags (name) VALUES
    ('Housing'),
    ('Utilities'),
    ('Food'),
    ('Transportation'),
    ('Healthcare'),
    ('Entertainment'),
    ('Shopping'),
    ('Travel'),
    ('Subscriptions'),
    ('Loans'),
    ('Income'),
    ('Savings');
