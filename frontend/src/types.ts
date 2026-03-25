export interface BudgetItem {
  id: number;
  name: string;
  amount: number;
  item_type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  day_of_month?: number;
  tags: string[];
  notes?: string;
  variable_amounts?: VariableAmount[];
  monthly_amount: number;
  primary_tag: string;
  created_at: string;
}

export interface CreateBudgetItem {
  name: string;
  amount: number;
  item_type: 'income' | 'expense';
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  day_of_month?: number;
  tags?: string[];
  notes?: string;
  variable_amounts?: VariableAmount[];
  primary_tag: string;
}

export interface VariableAmount {
  month: number;
  amount: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface SankeyData {
  nodes: { id: string }[];
  links: { source: string; target: string; value: number }[];
}

export interface UpcomingBill {
  name: string;
  amount: number;
  day_of_month: number;
  tags: string[];
  is_variable: boolean;
}

export interface SnapshotInfo {
  filename: string;
  created_at: string;
  label?: string;
}

export interface ActiveSnapshot {
  filename?: string;
  label?: string;
  created_at?: string;
}
