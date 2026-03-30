import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { HouseIcon, ListBulletsIcon, ChartBarIcon, TagIcon, BoxArrowDownIcon, WarningCircleIcon } from '@phosphor-icons/react'
import Dashboard from './pages/Dashboard'
import BudgetItems from './pages/BudgetItems'
import Summary from './pages/Summary'
import Tags from './pages/Tags'
import Snapshots from './pages/Snapshots'
import ThemeToggle from './components/ThemeToggle'
import ThemeSelector from './components/ThemeSelector'
import { ThemeProvider } from './context/ThemeContext'
import { fetchActiveSnapshot } from './api'
import type { ActiveSnapshot } from './types'

export default function App() {
  const [activeSnapshot, setActiveSnapshot] = useState<ActiveSnapshot | null>(null)

  useEffect(() => {
    fetchActiveSnapshot()
      .then((data) => setActiveSnapshot(data.filename ? data : null))
      .catch(() => setActiveSnapshot(null))
  }, [])

  const activeSnapshotTitle = activeSnapshot
    ? activeSnapshot.label
      ? activeSnapshot.label
      : activeSnapshot.created_at
      ? new Date(Number(activeSnapshot.created_at) * 1000).toLocaleString()
      : activeSnapshot.filename
    : null

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <nav className="nav">
            <div className="nav-brand">
              <img
                src="/icon-192.png"
                alt=""
                aria-hidden="true"
                style={{ width: '20px', height: '20px' }}
              />
              <span>Budget Overview</span>
            </div>
            {activeSnapshot && activeSnapshotTitle && (
              <div className="snapshot-warning-badge" role="status" aria-live="polite">
                <WarningCircleIcon size={16} /> <span>Snapshot active: {activeSnapshotTitle}</span>
              </div>
            )}
            <div className="nav-links">
              <NavLink to="/" end>
                <HouseIcon size={20} /> <span>Dashboard</span>
              </NavLink>
              <NavLink to="/items">
                <ListBulletsIcon size={20} /> <span>Items</span>
              </NavLink>
              <NavLink to="/summary">
                <ChartBarIcon size={20} /> <span>Summary</span>
              </NavLink>
              <NavLink to="/tags">
                <TagIcon size={20} /> <span>Tags</span>
              </NavLink>
              <NavLink to="/snapshots">
                <BoxArrowDownIcon size={20} /> <span>Snapshots</span>
              </NavLink>
            </div>
            <ThemeSelector />
            <ThemeToggle />
          </nav>
          <main className="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/items" element={<BudgetItems />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/snapshots" element={<Snapshots />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}