import { useState, useEffect } from 'react';
import { fetchBudgetItems, deleteBudgetItem } from '../api';
import type { BudgetItem } from '../types';
import BudgetItemForm from '../components/BudgetItemForm';
import { PlusIcon, TrashIcon, PencilSimpleIcon } from '@phosphor-icons/react';

export default function BudgetItems() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [editing, setEditing] = useState<BudgetItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState('');

  const load = () => fetchBudgetItems().then(setItems);
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteBudgetItem(id);
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Budget Items</h1>
        <div className="page-header-controls">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search items/tags"
            className="page-header-search"
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            <PlusIcon size={20} /> Add Item
          </button>
        </div>
      </div>

      {showForm && (
        <BudgetItemForm
          item={editing}
          onSave={() => {
            setShowForm(false);
            setEditing(null);
            load();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="items-grid">
        {items
          .filter((item) => {
            if (!searchText.trim()) return true;
            const q = searchText.trim().toLowerCase();
            const nameMatch = item.name.toLowerCase().includes(q);
            const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(q));
            return nameMatch || tagMatch;
          })
          .map((item) => (
          <div key={item.id} className={`item-card ${item.item_type}`}>
            <div className="item-card-header">
              <span className="item-name">{item.name}</span>
              <span className={`item-amount ${item.item_type}`}>
                {item.item_type === 'income' ? '+' : '-'}${item.monthly_amount.toFixed(2)}/mo
              </span>
            </div>
            <div className="item-card-meta">
              <span className="item-frequency">{item.frequency}</span>
              {item.day_of_month && <span>Day {item.day_of_month}</span>}
            </div>
            {item.tags.length > 0 && (
              <div className="item-tags">
                {item.tags.map((tag, index) => (
                  <span key={`${item.id}-${tag}`} className={`tag-badge ${index === 0 ? 'selected' : ''}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {item.notes && <p className="item-notes">{item.notes}</p>}
            <div className="item-actions">
              <button
                className="btn-icon"
                onClick={() => {
                  setEditing(item);
                  setShowForm(true);
                }}
              >
                <PencilSimpleIcon size={18} />
              </button>
              <button className="btn-icon danger" onClick={() => handleDelete(item.id)}>
                <TrashIcon size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <div className="empty-state">
          <p>No budget items yet. Click &quot;Add Item&quot; to get started.</p>
        </div>
      )}
    </div>
  );
}
