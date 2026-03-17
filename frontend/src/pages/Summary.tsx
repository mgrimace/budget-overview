import { useState, useEffect } from 'react';
import { fetchBudgetItems, fetchTags } from '../api';
import type { BudgetItem, Tag } from '../types';

export default function Summary() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchBudgetItems().then(setItems);
    fetchTags().then(setTags);
  }, []);

  const filtered =
    selectedTags.length > 0
      ? items.filter((item) => item.tags.some((t) => selectedTags.includes(t)))
      : items;

  const multiplier = viewMode === 'yearly' ? 12 : 1;

  const income = filtered
    .filter((i) => i.item_type === 'income')
    .reduce((sum, i) => sum + i.monthly_amount * multiplier, 0);

  const expenses = filtered
    .filter((i) => i.item_type === 'expense')
    .reduce((sum, i) => sum + i.monthly_amount * multiplier, 0);

  const net = income - expenses;

  const expenseByTag: Record<string, number> = {};
  filtered
    .filter((i) => i.item_type === 'expense')
    .forEach((item) => {
      const tag = item.tags[0] ?? 'Misc';
      expenseByTag[tag] = (expenseByTag[tag] ?? 0) + item.monthly_amount * multiplier;
    });

  const incomeByTag: Record<string, number> = {};
  filtered
    .filter((i) => i.item_type === 'income')
    .forEach((item) => {
      const tag = item.tags[0] ?? 'Other';
      incomeByTag[tag] = (incomeByTag[tag] ?? 0) + item.monthly_amount * multiplier;
    });

  const toggleTag = (name: string) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    );
  };

  return (
    <div className="page">
      <h1>Summary</h1>

      <div className="summary-controls">
        <div className="tag-selector">
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`tag-badge ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag.name)}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <div className="btn-group">
          <button
            className={`btn ${viewMode === 'monthly' ? 'active' : ''}`}
            onClick={() => setViewMode('monthly')}
          >
            Monthly
          </button>
          <button
            className={`btn ${viewMode === 'yearly' ? 'active' : ''}`}
            onClick={() => setViewMode('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p className="summary-value">${income.toFixed(2)}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Expenses</h3>
          <p className="summary-value">${expenses.toFixed(2)}</p>
        </div>
        <div className={`summary-card ${net >= 0 ? 'remaining' : 'deficit'}`}>
          <h3>{net >= 0 ? 'Remaining' : 'Deficit'}</h3>
          <p className="summary-value">${Math.abs(net).toFixed(2)}</p>
        </div>
      </div>

      <h2>Expenses by Category</h2>
      <div className="category-breakdown">
        {Object.entries(expenseByTag)
          .sort(([, a], [, b]) => b - a)
          .map(([tag, amount]) => (
            <div key={tag} className="category-row">
              <span className="category-name">{tag}</span>
              <div className="category-bar">
                <div
                  className="category-fill"
                  style={{ width: `${expenses > 0 ? (amount / expenses) * 100 : 0}%` }}
                />
              </div>
              <span className="category-amount">${amount.toFixed(2)}</span>
            </div>
          ))}
      </div>

      <h2>Income by Category</h2>
      <div className="category-breakdown">
        {Object.entries(incomeByTag)
          .sort(([, a], [, b]) => b - a)
          .map(([tag, amount]) => (
            <div key={tag} className="category-row">
              <span className="category-name">{tag}</span>
              <div className="category-bar">
                <div
                  className="category-fill category-fill--income"
                  style={{ width: `${income > 0 ? (amount / income) * 100 : 0}%` }}
                />
              </div>
              <span className="category-amount category-amount--income">
                ${amount.toFixed(2)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}