import type { BudgetItem, CreateBudgetItem, Tag, SankeyData, UpcomingBill, SnapshotInfo, ActiveSnapshot } from './types';

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

export async function updateBudgetItemPrimaryTag(id: number, primary_tag: string): Promise<BudgetItem> {
  const res = await fetch(`${API}/budget-items/${id}/primary-tag`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ primary_tag }),
  });
  return res.json();
}

export async function updateItemVisibility(id: number, visible: boolean): Promise<BudgetItem> {
  const res = await fetch(`${API}/budget-items/${id}/visibility`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visible }),
  });
  return res.json();
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

export async function fetchSnapshots(): Promise<SnapshotInfo[]> {
  const res = await fetch(`${API}/snapshots`);
  return res.json();
}

export async function createSnapshot(label?: string): Promise<SnapshotInfo> {
  const res = await fetch(`${API}/snapshots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });
  return res.json();
}

export async function activateSnapshot(filename: string): Promise<ActiveSnapshot> {
  const res = await fetch(`${API}/snapshots/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename }),
  });
  return res.json();
}

export async function resetSnapshot(): Promise<ActiveSnapshot> {
  const res = await fetch(`${API}/snapshots/reset`, {
    method: 'POST',
  });
  return res.json();
}

export async function fetchActiveSnapshot(): Promise<ActiveSnapshot> {
  const res = await fetch(`${API}/snapshots/active`);
  return res.json();
}

export async function deleteSnapshot(filename: string): Promise<void> {
  await fetch(`${API}/snapshots/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  });
}

export async function renameSnapshot(filename: string, label: string): Promise<SnapshotInfo> {
  const res = await fetch(`${API}/snapshots/${encodeURIComponent(filename)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });
  return res.json();
}

