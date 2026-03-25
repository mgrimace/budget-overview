import { useEffect, useState } from 'react';
import { ArchiveIcon, PencilSimpleIcon, PlusIcon, TrashIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
import { createSnapshot, fetchActiveSnapshot, fetchSnapshots, activateSnapshot, resetSnapshot, deleteSnapshot, renameSnapshot } from '../api';
import type { SnapshotInfo, ActiveSnapshot } from '../types';

export default function Snapshots() {
  const [snapshots, setSnapshots] = useState<SnapshotInfo[]>([]);
  const [active, setActive] = useState<ActiveSnapshot>({});
  const [label, setLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingFilename, setEditingFilename] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [list, activeItem] = await Promise.all([fetchSnapshots(), fetchActiveSnapshot()]);
      setSnapshots(list);
      setActive(activeItem);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSnapshot = async () => {
    await createSnapshot(label.trim() || undefined);
    setLabel('');
    await loadData();
  };

  const handleActivate = async (filename: string) => {
    await activateSnapshot(filename);
    await loadData();
    window.location.reload();
  };

  const handleReset = async () => {
    await resetSnapshot();
    await loadData();
    window.location.reload();
  };

  const handleDeleteSnapshot = async (filename: string) => {
    await deleteSnapshot(filename);
    await handleReset();
  };

  const handleRenameSnapshot = async () => {
    if (!editingFilename) return;
    const trimmedLabel = editingLabel.trim();
    await renameSnapshot(editingFilename, trimmedLabel);
    setEditingFilename(null);
    setEditingLabel('');
    await loadData();
    window.location.reload();
  };

  const activeLabel = active.label || (active.created_at ? new Date(Number(active.created_at) * 1000).toLocaleString() : active.filename);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Snapshots</h1>
      </div>
      <p className="snapshot-helper-text">Create a snapshot to save your current values before changing or updating them for a new year. This lets you easily revisit previous bills.</p>
      <form className="tag-create-form" onSubmit={(e) => { e.preventDefault(); handleCreateSnapshot(); }}>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Optional snapshot label"
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          <PlusIcon size={16} /> Add
        </button>
      </form>

      <p className="summary-value">
        Viewing: <strong>{active.filename ? activeLabel : 'Current'}</strong>
      </p>

      <div className="summary-cards" style={{ gap: '8px', marginTop: '12px' }}>

        <div className={`summary-card ${!active.filename ? 'active' : ''}`}>
          <h3>Current database</h3>
          <p>The active database</p>
          <button className="btn btn-primary" onClick={handleReset} disabled={isLoading || !active.filename}>
            Return to Current
          </button>
        </div>

        {snapshots.length === 0 && <div className="empty-state">No snapshots yet.</div>}

        {snapshots.map((snapshot) => {
          const snapshotLabel = snapshot.label || snapshot.filename;
          const isActive = active.filename === snapshot.filename;
          const isEditing = editingFilename === snapshot.filename;
          return (
            <div key={snapshot.filename} className={`summary-card ${isActive ? 'active' : ''}`}>
              {isEditing ? (
                <div className="input-with-icon">
                  <PencilSimpleIcon size={16} />
                  <input
                    value={editingLabel}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    placeholder="Snapshot label"
                    className="page-header-search"
                  />
                </div>
              ) : (
                <>
                  <h3>{snapshotLabel}</h3>
                  <p>{snapshot.created_at ? new Date(Number(snapshot.created_at) * 1000).toLocaleString() : 'Unknown'}</p>
                </>
              )}

              <div className="snapshot-footer-row">
                <button
                  className="btn btn-primary snapshot-activate-btn"
                  onClick={() => handleActivate(snapshot.filename)}
                  disabled={isLoading || isActive || isEditing}
                >
                  Activate
                </button>
                <div className="snapshot-footer-icons">
                {isEditing ? (
                  <>
                    <button className="btn-icon" onClick={handleRenameSnapshot}>
                      <CheckIcon size={18} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setEditingFilename(null);
                        setEditingLabel('');
                      }}
                    >
                      <XIcon size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setEditingFilename(snapshot.filename);
                        setEditingLabel(snapshot.label || '');
                      }}
                    >
                      <PencilSimpleIcon size={18} />
                    </button>
                    <button className="btn-icon danger" onClick={() => handleDeleteSnapshot(snapshot.filename)}>
                      <TrashIcon size={18} />
                    </button>
                  </>
                )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
