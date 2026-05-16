import type { BudgetItem, SankeyData } from './types';

export function getYearlyAmount(item: BudgetItem): number {
  if (item.frequency === 'yearly') {
    return item.amount;
  }

  if (item.variable_amounts?.length) {
    return item.variable_amounts.reduce((sum, entry) => sum + entry.amount, 0);
  }

  return item.monthly_amount * 12;
}

export function buildYearlySankeyData(items: BudgetItem[]): SankeyData {
  const visibleItems = items.filter((item) => item.visible);
  const incomeItems = visibleItems.filter((item) => item.item_type === 'income');
  const expenseItems = visibleItems.filter((item) => item.item_type === 'expense');

  const expenseByTag: Record<string, number> = {};
  expenseItems.forEach((item) => {
    const tag = item.primary_tag || 'Misc';
    expenseByTag[tag] = (expenseByTag[tag] ?? 0) + getYearlyAmount(item);
  });

  const incomeTotal = incomeItems.reduce((sum, item) => sum + getYearlyAmount(item), 0);
  const expenseTotal = Object.values(expenseByTag).reduce((sum, amount) => sum + amount, 0);

  if (incomeTotal === 0 && expenseTotal === 0) {
    return { nodes: [], links: [] };
  }

  const nodes: { id: string }[] = [];
  const links: { source: string; target: string; value: number }[] = [];
  const budgetNode = 'Budget';

  const nodeIds = new Set<string>();

  incomeItems.forEach((item) => {
    const source = item.name;
    if (!nodeIds.has(source)) {
      nodes.push({ id: source });
      nodeIds.add(source);
    }

    links.push({
      source,
      target: budgetNode,
      value: getYearlyAmount(item),
    });
  });

  if (!nodeIds.has(budgetNode)) {
    nodes.push({ id: budgetNode });
    nodeIds.add(budgetNode);
  }

  Object.entries(expenseByTag).forEach(([tag, amount]) => {
    if (!nodeIds.has(tag)) {
      nodes.push({ id: tag });
      nodeIds.add(tag);
    }

    links.push({
      source: budgetNode,
      target: tag,
      value: amount,
    });
  });

  const diff = incomeTotal - expenseTotal;
  if (diff > 0) {
    nodes.push({ id: 'Remaining' });
    links.push({
      source: budgetNode,
      target: 'Remaining',
      value: diff,
    });
  } else if (diff < 0) {
    nodes.push({ id: 'Deficit' });
    links.push({
      source: budgetNode,
      target: 'Deficit',
      value: Math.abs(diff),
    });
  }

  return { nodes, links };
}
