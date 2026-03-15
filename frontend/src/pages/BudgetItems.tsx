import { useState, useEffect } from 'react';
import { fetchBudgetItems, deleteBudgetItem } from '../api';
import type { BudgetItem } from '../types';
import BudgetItemForm from '../components/BudgetItemForm';
import { Plus, Trash, PencilSimple } from '@phosphor-icons/react';

export default function BudgetItems() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [editing, setEditing] = useState<BudgetItem | null>(null);
  const [showForm, setShowForm] = useState(false);

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
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus size={20} /> Add Item
        </button>
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
        {items.map((item) => (
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
                {item.tags.map((tag) => (
                  <span key={tag} className="tag-badge">
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
                <PencilSimple size={18} />
              </button>
              <button className="btn-icon danger" onClick={() => handleDelete(item.id)}>
                <Trash size={18} />
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
