import { useState, useEffect } from 'react';
import { createBudgetItem, updateBudgetItem, fetchTags } from '../api';
import type { BudgetItem, CreateBudgetItem, Tag } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Props {
  item: BudgetItem | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function BudgetItemForm({ item, onSave, onCancel }: Props) {
  const [name, setName] = useState(item?.name ?? '');
  const [amount, setAmount] = useState(item?.amount ?? 0);
  const [itemType, setItemType] = useState<'income' | 'expense'>(item?.item_type ?? 'expense');
  const [frequency, setFrequency] = useState(item?.frequency ?? 'monthly');
  const [dayOfMonth, setDayOfMonth] = useState<number | ''>(item?.day_of_month ?? '');
  // Add default 'Income' tag for salary/freelance if creating new income item
  const defaultIncomeTags = ['salary', 'freelance', 'contract', 'consulting'];
  const isNewIncome = !item && itemType === 'income';
  const [selectedTags, setSelectedTags] = useState<string[]>(
    item?.tags ?? (isNewIncome ? ['Income'] : [])
  );
  const [notes, setNotes] = useState(item?.notes ?? '');
  const [isVariable, setIsVariable] = useState(!!item?.variable_amounts?.length);
  const [variableAmounts, setVariableAmounts] = useState<number[]>(
    item?.variable_amounts
      ? Array.from({ length: 12 }, (_, i) => {
          const va = item.variable_amounts?.find((v) => v.month === i + 1);
          return va?.amount ?? 0;
        })
      : Array(12).fill(0),
  );
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchTags().then(setAvailableTags);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let tagsToSave = selectedTags;
    // If new income and no tags, add 'Income' tag by default
    if (isNewIncome && tagsToSave.length === 0) {
      tagsToSave = ['Income'];
    }
    // If new income and tag matches default income sources, add 'Income' tag
    if (isNewIncome && !tagsToSave.includes('Income')) {
      if (defaultIncomeTags.some((t) => name.toLowerCase().includes(t))) {
        tagsToSave = [...tagsToSave, 'Income'];
      }
    }
    const data: CreateBudgetItem = {
      name,
      amount: isVariable ? 0 : amount,
      item_type: itemType,
      frequency: isVariable ? 'monthly' : frequency,
      day_of_month: dayOfMonth === '' ? undefined : dayOfMonth,
      tags: tagsToSave.length > 0 ? tagsToSave : undefined,
      notes: notes || undefined,
      variable_amounts: isVariable
        ? variableAmounts
            .map((amt, i) => ({ month: i + 1, amount: amt }))
            .filter((v) => v.amount > 0)
        : undefined,
    };
    if (item) {
      await updateBudgetItem(item.id, data);
    } else {
      await createBudgetItem(data);
    }
    onSave();
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName],
    );
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <h2>{item ? 'Edit Item' : 'New Budget Item'}</h2>

      <div className="form-row">
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="form-row">
        <label>Type</label>
        <div className="btn-group">
          <button
            type="button"
            className={`btn ${itemType === 'income' ? 'active' : ''}`}
            onClick={() => setItemType('income')}
          >
            Income
          </button>
          <button
            type="button"
            className={`btn ${itemType === 'expense' ? 'active' : ''}`}
            onClick={() => setItemType('expense')}
          >
            Expense
          </button>
        </div>
      </div>

      <div className="form-row">
        <label>
          <input
            type="checkbox"
            checked={isVariable}
            onChange={(e) => setIsVariable(e.target.checked)}
          />{' '}
          Variable monthly amounts
        </label>
      </div>

      {isVariable ? (
        <div className="variable-amounts">
          {MONTHS.map((month, i) => (
            <div key={month} className="form-row-inline">
              <label>{month}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={variableAmounts[i]}
                onChange={(e) => {
                  const next = [...variableAmounts];
                  next[i] = parseFloat(e.target.value) || 0;
                  setVariableAmounts(next);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="form-row">
            <label>Amount ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          <div className="form-row">
            <label>Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value as CreateBudgetItem['frequency'])}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </>
      )}

      <div className="form-row">
        <label>Day of Month (optional)</label>
        <input
          type="number"
          min="1"
          max="31"
          value={dayOfMonth}
          onChange={(e) =>
            setDayOfMonth(e.target.value === '' ? '' : parseInt(e.target.value))
          }
        />
      </div>

      <div className="form-row">
        <label>Tags</label>
        <div className="tag-selector">
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              className={`tag-badge ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag.name)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <label>Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {item ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
