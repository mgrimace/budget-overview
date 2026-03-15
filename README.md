# Budget Overview

A visual budgeting tool that shows where your money goes each month using a Sankey-style flow diagram.

## Overview

Enter recurring income and expenses. The system normalizes everything to monthly values and visualizes your cash flow.

**Flow: Income Sources → Cash Flow → Expense Categories → Surplus or Deficit**

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Rust, Axum
- **Database**: SQLite
- **Visualization**: @nivo/sankey
- **Icons**: Phosphor React
- **Font**: Atkinson Hyperlegible

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (1.70+)
- [Node.js](https://nodejs.org/) (18+)

### Development

**Backend:**

```bash
cd backend
cargo run
```

Server starts on http://localhost:3001

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

App available at http://localhost:5173

### Docker

```bash
docker compose up --build
```

App available at http://localhost:3001

## API Endpoints

| Method | Path                  | Description            |
| ------ | --------------------- | ---------------------- |
| GET    | /api/budget-items     | List all budget items  |
| POST   | /api/budget-items     | Create a budget item   |
| GET    | /api/budget-items/:id | Get a budget item      |
| PUT    | /api/budget-items/:id | Update a budget item   |
| DELETE | /api/budget-items/:id | Delete a budget item   |
| GET    | /api/tags             | List all tags          |
| POST   | /api/tags             | Create a tag           |
| PUT    | /api/tags/:id         | Rename a tag           |
| DELETE | /api/tags/:id         | Delete a tag           |
| GET    | /api/cashflow         | Get Sankey diagram data|
| GET    | /api/upcoming-bills   | Get upcoming bills     |

## Normalization

| Frequency | Formula        |
| --------- | -------------- |
| Daily     | amount × 30    |
| Weekly    | amount × 4.33  |
| Biweekly  | amount × 2.17  |
| Monthly   | amount         |
| Yearly    | amount ÷ 12    |

Variable bills (e.g., utilities with different monthly amounts) are averaged across provided months.

## Default Tags

Housing, Utilities, Food, Transportation, Healthcare, Entertainment, Shopping, Travel, Subscriptions, Loans, Misc

## Pages

- **Dashboard** — Sankey cash flow diagram + upcoming bills sidebar
- **Items** — CRUD for budget items with variable bill support
- **Summary** — Filter by tags, toggle monthly/yearly totals, category breakdown
- **Tags** — Create, rename, and delete tags

## Theme

Supports light and dark themes via CSS design tokens. Toggle in the nav bar.
