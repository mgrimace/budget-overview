import type { BudgetItem, CreateBudgetItem, Tag, SankeyData, UpcomingBill } from './types';

const API = '/api';

export async function fetchBudgetItems(): Promise<BudgetItem[]> {
  const res = await fetch(`${API}/budget-items`);
  return res.json();
}

export async function createBudgetItem(item: CreateBudgetItem): Promise<BudgetItem> {
  const res = await fetch(`${API}/budget-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function updateBudgetItem(id: number, item: CreateBudgetItem): Promise<BudgetItem> {
  const res = await fetch(`${API}/budget-items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function deleteBudgetItem(id: number): Promise<void> {
  await fetch(`${API}/budget-items/${id}`, { method: 'DELETE' });
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await fetch(`${API}/tags`);
  return res.json();
}

export async function createTag(name: string): Promise<Tag> {
  const res = await fetch(`${API}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function renameTag(id: number, name: string): Promise<Tag> {
  const res = await fetch(`${API}/tags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function deleteTag(id: number): Promise<void> {
  await fetch(`${API}/tags/${id}`, { method: 'DELETE' });
}

export async function fetchCashflow(): Promise<SankeyData> {
  const res = await fetch(`${API}/cashflow`);
  return res.json();
}

export async function fetchUpcomingBills(): Promise<UpcomingBill[]> {
  const res = await fetch(`${API}/upcoming-bills`);
  return res.json();
}
