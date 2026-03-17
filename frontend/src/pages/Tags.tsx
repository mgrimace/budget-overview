import { useState, useEffect } from 'react';
import { fetchTags, createTag, renameTag, deleteTag } from '../api';
import type { Tag } from '../types';
import { PlusIcon, TrashIcon, PencilSimpleIcon, CheckIcon, XIcon } from '@phosphor-icons/react';

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const load = () => fetchTags().then(setTags);
  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    await createTag(newTagName.trim());
    setNewTagName('');
    load();
  };

  const handleRename = async (id: number) => {
    if (!editName.trim()) return;
    await renameTag(id, editName.trim());
    setEditingId(null);
    load();
  };

  const handleDelete = async (id: number) => {
    await deleteTag(id);
    load();
  };

  return (
    <div className="page">
      <h1>Tags</h1>

      <form className="tag-create-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          <PlusIcon size={20} /> Add
        </button>
      </form>

      <div className="tags-list">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-row">
            {editingId === tag.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                />
                <button className="btn-icon" onClick={() => handleRename(tag.id)}>
                  <CheckIcon size={18} />
                </button>
                <button className="btn-icon" onClick={() => setEditingId(null)}>
                  <XIcon size={18} />
                </button>
              </>
            ) : (
              <>
                <span className="tag-name">{tag.name}</span>
                <button
                  className="btn-icon"
                  onClick={() => {
                    setEditingId(tag.id);
                    setEditName(tag.name);
                  }}
                >
                  <PencilSimpleIcon size={18} />
                </button>
                <button className="btn-icon danger" onClick={() => handleDelete(tag.id)}>
                  <TrashIcon size={18} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
