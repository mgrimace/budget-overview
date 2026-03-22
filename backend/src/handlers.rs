use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use std::collections::{HashMap, HashSet};

use crate::db::Db;
use crate::models::*;

type BudgetItemRow = (i64, String, f64, String, String, Option<i32>, Option<String>, String);

// --- Normalization ---

fn normalize_to_monthly(amount: f64, frequency: &str) -> f64 {
    match frequency {
        "daily" => amount * 30.0,
        "weekly" => amount * 4.33,
        "biweekly" => amount * 2.17,
        "monthly" => amount,
        "yearly" => amount / 12.0,
        _ => amount,
    }
}

fn average_variable_amounts(amounts: &[VariableAmount]) -> f64 {
    if amounts.is_empty() {
        return 0.0;
    }
    let sum: f64 = amounts.iter().map(|a| a.amount).sum();
    sum / 12.0
}

fn get_item_tags(conn: &rusqlite::Connection, item_id: i64) -> Vec<String> {
    conn.prepare(
        "SELECT t.name FROM tags t JOIN budget_item_tags bt ON t.id = bt.tag_id WHERE bt.budget_item_id = ?1",
    )
    .and_then(|mut stmt| {
        let tags = stmt
            .query_map([item_id], |row| row.get(0))?
            .filter_map(|r| r.ok())
            .collect();
        Ok(tags)
    })
    .unwrap_or_default()
}

fn get_variable_amounts(conn: &rusqlite::Connection, item_id: i64) -> Vec<VariableAmount> {
    conn.prepare("SELECT month, amount FROM variable_amounts WHERE budget_item_id = ?1 ORDER BY month")
        .and_then(|mut stmt| {
            let amounts = stmt
                .query_map([item_id], |row| {
                    Ok(VariableAmount {
                        month: row.get(0)?,
                        amount: row.get(1)?,
                    })
                })?
                .filter_map(|r| r.ok())
                .collect();
            Ok(amounts)
        })
        .unwrap_or_default()
}

#[allow(clippy::too_many_arguments)]
fn build_budget_item(
    conn: &rusqlite::Connection,
    id: i64,
    name: String,
    amount: f64,
    item_type: String,
    frequency: String,
    day_of_month: Option<i32>,
    notes: Option<String>,
    created_at: String,
) -> BudgetItem {
    let tags = get_item_tags(conn, id);
    let variable_amounts = get_variable_amounts(conn, id);
    let monthly_amount = if !variable_amounts.is_empty() {
        average_variable_amounts(&variable_amounts)
    } else {
        normalize_to_monthly(amount, &frequency)
    };
    BudgetItem {
        id,
        name,
        amount,
        item_type,
        frequency,
        day_of_month,
        tags,
        notes,
        variable_amounts: if variable_amounts.is_empty() {
            None
        } else {
            Some(variable_amounts)
        },
        monthly_amount,
        created_at,
    }
}

fn save_tags(conn: &rusqlite::Connection, item_id: i64, tags: &Option<Vec<String>>) {
    if let Some(ref tags) = tags {
        for tag_name in tags {
            conn.execute("INSERT OR IGNORE INTO tags (name) VALUES (?1)", [tag_name])
                .ok();
            if let Ok(tag_id) = conn.query_row(
                "SELECT id FROM tags WHERE name = ?1",
                [tag_name],
                |row| row.get::<_, i64>(0),
            ) {
                conn.execute(
                    "INSERT OR IGNORE INTO budget_item_tags (budget_item_id, tag_id) VALUES (?1, ?2)",
                    rusqlite::params![item_id, tag_id],
                )
                .ok();
            }
        }
    }
}

fn save_variable_amounts(
    conn: &rusqlite::Connection,
    item_id: i64,
    amounts: &Option<Vec<VariableAmount>>,
) {
    if let Some(ref var_amounts) = amounts {
        for va in var_amounts {
            conn.execute(
                "INSERT OR REPLACE INTO variable_amounts (budget_item_id, month, amount) VALUES (?1, ?2, ?3)",
                rusqlite::params![item_id, va.month, va.amount],
            )
            .ok();
        }
    }
}

// --- Budget Items ---

pub async fn list_budget_items(State(db): State<Db>) -> Result<Json<Vec<BudgetItem>>, StatusCode> {
    let db = db.lock().await;

    let mut stmt = db
        .prepare(
            "SELECT id, name, amount, item_type, frequency, day_of_month, notes, created_at \
             FROM budget_items ORDER BY created_at DESC",
        )
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let items: Vec<BudgetItemRow> = stmt.query_map([], |row| {
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, f64>(2)?,
                row.get::<_, String>(3)?,
                row.get::<_, String>(4)?,
                row.get::<_, Option<i32>>(5)?,
                row.get::<_, Option<String>>(6)?,
                row.get::<_, String>(7)?,
            ))
        })
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .filter_map(|r| r.ok())
        .collect();
    drop(stmt);

    let result = items
        .into_iter()
        .map(
            |(id, name, amount, item_type, frequency, day_of_month, notes, created_at)| {
                build_budget_item(&db, id, name, amount, item_type, frequency, day_of_month, notes, created_at)
            },
        )
        .collect();

    Ok(Json(result))
}

pub async fn create_budget_item(
    State(db): State<Db>,
    Json(input): Json<CreateBudgetItem>,
) -> Result<(StatusCode, Json<BudgetItem>), StatusCode> {
    let db = db.lock().await;

    db.execute(
        "INSERT INTO budget_items (name, amount, item_type, frequency, day_of_month, notes) \
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        rusqlite::params![
            input.name,
            input.amount,
            input.item_type,
            input.frequency,
            input.day_of_month,
            input.notes
        ],
    )
    .map_err(|_| StatusCode::BAD_REQUEST)?;

    let id = db.last_insert_rowid();
    save_tags(&db, id, &input.tags);
    save_variable_amounts(&db, id, &input.variable_amounts);

    let created_at = db
        .query_row(
            "SELECT created_at FROM budget_items WHERE id = ?1",
            [id],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_default();

    let item = build_budget_item(
        &db,
        id,
        input.name,
        input.amount,
        input.item_type,
        input.frequency,
        input.day_of_month,
        input.notes,
        created_at,
    );

    Ok((StatusCode::CREATED, Json(item)))
}

pub async fn get_budget_item(
    State(db): State<Db>,
    Path(id): Path<i64>,
) -> Result<Json<BudgetItem>, StatusCode> {
    let db = db.lock().await;

    let (id, name, amount, item_type, frequency, day_of_month, notes, created_at): BudgetItemRow =
        db.query_row(
            "SELECT id, name, amount, item_type, frequency, day_of_month, notes, created_at \
             FROM budget_items WHERE id = ?1",
            [id],
            |row| {
                Ok((
                    row.get::<_, i64>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, f64>(2)?,
                    row.get::<_, String>(3)?,
                    row.get::<_, String>(4)?,
                    row.get::<_, Option<i32>>(5)?,
                    row.get::<_, Option<String>>(6)?,
                    row.get::<_, String>(7)?,
                ))
            },
        )
        .map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(build_budget_item(
        &db,
        id,
        name,
        amount,
        item_type,
        frequency,
        day_of_month,
        notes,
        created_at,
    )))
}

pub async fn update_budget_item(
    State(db): State<Db>,
    Path(id): Path<i64>,
    Json(input): Json<CreateBudgetItem>,
) -> Result<Json<BudgetItem>, StatusCode> {
    let db = db.lock().await;

    let changes = db
        .execute(
            "UPDATE budget_items SET name=?1, amount=?2, item_type=?3, frequency=?4, \
             day_of_month=?5, notes=?6 WHERE id=?7",
            rusqlite::params![
                input.name,
                input.amount,
                input.item_type,
                input.frequency,
                input.day_of_month,
                input.notes,
                id
            ],
        )
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if changes == 0 {
        return Err(StatusCode::NOT_FOUND);
    }

    db.execute("DELETE FROM budget_item_tags WHERE budget_item_id = ?1", [id])
        .ok();
    save_tags(&db, id, &input.tags);

    db.execute("DELETE FROM variable_amounts WHERE budget_item_id = ?1", [id])
        .ok();
    save_variable_amounts(&db, id, &input.variable_amounts);

    let created_at = db
        .query_row(
            "SELECT created_at FROM budget_items WHERE id = ?1",
            [id],
            |row| row.get::<_, String>(0),
        )
        .unwrap_or_default();

    Ok(Json(build_budget_item(
        &db,
        id,
        input.name,
        input.amount,
        input.item_type,
        input.frequency,
        input.day_of_month,
        input.notes,
        created_at,
    )))
}

pub async fn delete_budget_item(
    State(db): State<Db>,
    Path(id): Path<i64>,
) -> StatusCode {
    let db = db.lock().await;
    match db.execute("DELETE FROM budget_items WHERE id = ?1", [id]) {
        Ok(changes) if changes > 0 => StatusCode::NO_CONTENT,
        _ => StatusCode::NOT_FOUND,
    }
}

// --- Tags ---

pub async fn list_tags(State(db): State<Db>) -> Result<Json<Vec<Tag>>, StatusCode> {
    let db = db.lock().await;
    let mut stmt = db
        .prepare("SELECT id, name FROM tags ORDER BY name")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let tags: Vec<Tag> = stmt.query_map([], |row| {
        Ok(Tag {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    })
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .filter_map(|r| r.ok())
    .collect();
    Ok(Json(tags))
}

pub async fn create_tag(
    State(db): State<Db>,
    Json(input): Json<CreateTag>,
) -> Result<(StatusCode, Json<Tag>), StatusCode> {
    let db = db.lock().await;
    db.execute("INSERT INTO tags (name) VALUES (?1)", [&input.name])
        .map_err(|_| StatusCode::CONFLICT)?;
    let id = db.last_insert_rowid();
    Ok((StatusCode::CREATED, Json(Tag { id, name: input.name })))
}

pub async fn rename_tag(
    State(db): State<Db>,
    Path(id): Path<i64>,
    Json(input): Json<RenameTag>,
) -> Result<Json<Tag>, StatusCode> {
    let db = db.lock().await;
    let changes = db
        .execute(
            "UPDATE tags SET name = ?1 WHERE id = ?2",
            rusqlite::params![input.name, id],
        )
        .map_err(|_| StatusCode::CONFLICT)?;
    if changes == 0 {
        return Err(StatusCode::NOT_FOUND);
    }
    Ok(Json(Tag { id, name: input.name }))
}

pub async fn delete_tag(State(db): State<Db>, Path(id): Path<i64>) -> StatusCode {
    let db = db.lock().await;
    match db.execute("DELETE FROM tags WHERE id = ?1", [id]) {
        Ok(changes) if changes > 0 => StatusCode::NO_CONTENT,
        _ => StatusCode::NOT_FOUND,
    }
}

// --- Cashflow (Sankey Data) ---

pub async fn get_cashflow(State(db): State<Db>) -> Result<Json<SankeyData>, StatusCode> {
    let db = db.lock().await;

    let mut stmt = db
        .prepare("SELECT id, name, amount, item_type, frequency FROM budget_items")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let items: Vec<(i64, String, f64, String, String)> = stmt.query_map([], |row| {
        Ok((
            row.get::<_, i64>(0)?,
            row.get::<_, String>(1)?,
            row.get::<_, f64>(2)?,
            row.get::<_, String>(3)?,
            row.get::<_, String>(4)?,
        ))
    })
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .filter_map(|r| r.ok())
    .collect();
    drop(stmt);

    let mut nodes = vec![];
    let mut links = vec![];
    let mut income_total = 0.0;
    let mut expense_by_tag: HashMap<String, f64> = HashMap::new();
    let mut node_ids: HashSet<String> = HashSet::new();

    for (id, name, amount, item_type, frequency) in &items {
        let var_amounts = get_variable_amounts(&db, *id);
        let monthly = if !var_amounts.is_empty() {
            average_variable_amounts(&var_amounts)
        } else {
            normalize_to_monthly(*amount, frequency)
        };

        if item_type == "income" {
            if node_ids.insert(name.clone()) {
                nodes.push(SankeyNode { id: name.clone() });
            }
            links.push(SankeyLink {
                source: name.clone(),
                target: "Budget".to_string(),
                value: monthly,
            });
            income_total += monthly;
        } else {
            let tags = get_item_tags(&db, *id);
            let tag = tags.first().cloned().unwrap_or_else(|| "Misc".to_string());
            *expense_by_tag.entry(tag).or_insert(0.0) += monthly;
        }
    }

    if income_total == 0.0 && expense_by_tag.is_empty() {
        return Ok(Json(SankeyData {
            nodes: vec![],
            links: vec![],
        }));
    }

    if node_ids.insert("Budget".to_string()) {
        nodes.push(SankeyNode {
            id: "Budget".to_string(),
        });
    }

    let mut expense_total = 0.0;
    for (tag, amount) in &expense_by_tag {
        if node_ids.insert(tag.clone()) {
            nodes.push(SankeyNode { id: tag.clone() });
        }
        links.push(SankeyLink {
            source: "Budget".to_string(),
            target: tag.clone(),
            value: *amount,
        });
        expense_total += amount;
    }

    let diff = income_total - expense_total;
    if diff > 0.0 {
        nodes.push(SankeyNode { id: "Remaining".to_string() });
        links.push(SankeyLink {
            source: "Budget".to_string(),
            target: "Remaining".to_string(),
            value: diff,
        });
    } else if diff < 0.0 {
        nodes.push(SankeyNode { id: "Deficit".to_string() });
        links.push(SankeyLink {
            source: "Budget".to_string(),
            target: "Deficit".to_string(),
            value: diff.abs(),
        });
    }

    Ok(Json(SankeyData { nodes, links }))
}

// --- Upcoming Bills ---

pub async fn get_upcoming_bills(State(db): State<Db>) -> Result<Json<Vec<UpcomingBill>>, StatusCode> {
    let db = db.lock().await;

    let mut stmt = db
        .prepare(
            "SELECT id, name, amount, day_of_month FROM budget_items \
             WHERE item_type = 'expense' AND day_of_month IS NOT NULL \
             ORDER BY day_of_month",
        )
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let rows: Vec<(i64, String, f64, i32)> = stmt.query_map([], |row| {
        Ok((
            row.get::<_, i64>(0)?,
            row.get::<_, String>(1)?,
            row.get::<_, f64>(2)?,
            row.get::<_, i32>(3)?,
        ))
    })
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
    .filter_map(|r| r.ok())
    .collect();
    drop(stmt);

    let bills = rows
        .into_iter()
        .map(|(id, name, amount, day_of_month)| {
            let tags = get_item_tags(&db, id);
            UpcomingBill {
                name,
                amount,
                day_of_month,
                tags,
            }
        })
        .collect();

    Ok(Json(bills))
}
