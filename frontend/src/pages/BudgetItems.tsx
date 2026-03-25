import { useState, useEffect } from 'react';
import { fetchBudgetItems, deleteBudgetItem, updateBudgetItemPrimaryTag } from '../api';
import type { BudgetItem } from '../types';
import BudgetItemForm from '../components/BudgetItemForm';
import { PlusIcon, TrashIcon, PencilSimpleIcon, FunnelSimpleIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

export default function BudgetItems() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [editing, setEditing] = useState<BudgetItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortMode, setSortMode] = useState<'name' | 'name_desc' | 'amount_desc' | 'amount_asc' | 'date_desc' | 'date_asc'>('amount_desc');

  const load = () => fetchBudgetItems().then(setItems);
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteBudgetItem(id);
    load();
  };

  const filteredItems = items.filter((item) => {
    if (!searchText.trim()) return true;
    const q = searchText.trim().toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(q);
    const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(q));
    return nameMatch || tagMatch;
  });

  const visibleItems = [...filteredItems].sort((a, b) => {
    switch (sortMode) {
      case 'name':
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      case 'name_desc':
        return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
      case 'amount_desc':
        return b.monthly_amount - a.monthly_amount;
      case 'amount_asc':
        return a.monthly_amount - b.monthly_amount;
      case 'date_desc': {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bDate - aDate;
      }
      case 'date_asc': {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return aDate - bDate;
      }
      default:
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Budget Items</h1>
        <div className="page-header-controls">
          <div className="input-with-icon">
            <MagnifyingGlassIcon size={16} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search items/tags"
              className="page-header-search"
            />
          </div>

          <div className="sort-control">
            <FunnelSimpleIcon size={16} />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as 'name' | 'name_desc' | 'amount_desc' | 'amount_asc' | 'date_desc' | 'date_asc')}
              className="sort-select"
            >
              <option value="name">A–Z</option>
              <option value="name_desc">Z–A</option>
              <option value="amount_desc">Highest $</option>
              <option value="amount_asc">Lowest $</option>
              <option value="date_desc">Newest</option>
              <option value="date_asc">Oldest</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
          >
            <PlusIcon size={16} /> Add Item
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
        {visibleItems.map((item) => (
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
                {item.tags.map((tag) => {
                  const isPrimary = tag === item.primary_tag;
                  return (
                    <button
                      key={`${item.id}-${tag}`}
                      type="button"
                      className={`tag-badge ${isPrimary ? 'selected' : ''}`}
                      onClick={async () => {
                        if (!isPrimary && item.tags.length > 1) {
                          await updateBudgetItemPrimaryTag(item.id, tag);
                          load();
                        }
                      }}
                      title={isPrimary ? 'Primary tag' : 'Click to make primary'}
                    >
                      {tag}
                    </button>
                  );
                })}
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
