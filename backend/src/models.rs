use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BudgetItem {
    pub id: i64,
    pub name: String,
    pub amount: f64,
    pub item_type: String,
    pub frequency: String,
    pub day_of_month: Option<i32>,
    pub tags: Vec<String>,
    pub notes: Option<String>,
    pub variable_amounts: Option<Vec<VariableAmount>>,
    pub monthly_amount: f64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateBudgetItem {
    pub name: String,
    pub amount: f64,
    pub item_type: String,
    pub frequency: String,
    pub day_of_month: Option<i32>,
    pub tags: Option<Vec<String>>,
    pub notes: Option<String>,
    pub variable_amounts: Option<Vec<VariableAmount>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VariableAmount {
    pub month: i32,
    pub amount: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Tag {
    pub id: i64,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateTag {
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RenameTag {
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SankeyData {
    pub nodes: Vec<SankeyNode>,
    pub links: Vec<SankeyLink>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SankeyNode {
    pub id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SankeyLink {
    pub source: String,
    pub target: String,
    pub value: f64,
}

#[derive(Debug, Serialize)]
pub struct UpcomingBill {
    pub name: String,
    pub amount: f64,
    pub day_of_month: i32,
    pub tags: Vec<String>,
    pub is_variable: bool,
}
