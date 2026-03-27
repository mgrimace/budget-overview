import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTags, createTag, renameTag, deleteTag } from '../api';
import type { Tag } from '../types';
import { PlusIcon, TrashIcon, PencilSimpleIcon, CheckIcon, XIcon } from '@phosphor-icons/react';

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

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

      <div className="tags-grid">
        {tags.map((tag) => {
          const isEditing = editingId === tag.id;
          const handleNavigateTag = () => {
            if (!isEditing) {
              navigate(`/summary?tag=${encodeURIComponent(tag.name)}`);
            }
          };

          return (
            <div
              key={tag.id}
              className={`tag-pill ${isEditing ? '' : 'clickable'}`}
              onClick={handleNavigateTag}
              role={isEditing ? undefined : 'button'}
              tabIndex={isEditing ? undefined : 0}
              onKeyDown={(e) => {
                if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleNavigateTag();
                }
              }}
            >
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(tag.id);
                    }}
                  >
                    <CheckIcon size={18} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(null);
                    }}
                  >
                    <XIcon size={18} />
                  </button>
                </>
              ) : (
                <>
                  <span className="tag-name">{tag.name}</span>
                  <button
                    className="btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(tag.id);
                      setEditName(tag.name);
                    }}
                  >
                    <PencilSimpleIcon size={18} />
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(tag.id);
                    }}
                  >
                    <TrashIcon size={18} />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
