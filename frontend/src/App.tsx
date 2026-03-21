import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { HouseIcon, ListBulletsIcon, ChartBarIcon, TagIcon } from '@phosphor-icons/react'
import Dashboard from './pages/Dashboard'
import BudgetItems from './pages/BudgetItems'
import Summary from './pages/Summary'
import Tags from './pages/Tags'
import ThemeToggle from './components/ThemeToggle'
import ThemeSelector from './components/ThemeSelector'
import { ThemeProvider } from './context/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <nav className="nav">
            <div className="nav-brand">
              <img src="/icon-192.png" alt="" aria-hidden="true" />
              <span>Budget Overview</span>
            </div>
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
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}