import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { HouseIcon, ListBulletsIcon, ChartBarIcon, TagIcon } from '@phosphor-icons/react';
import Dashboard from './pages/Dashboard';
import BudgetItems from './pages/BudgetItems';
import Summary from './pages/Summary';
import Tags from './pages/Tags';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">
            <img src="/icon-192.png" alt="" aria-hidden="true" />
            Budget Overview
          </div>
          <div className="nav-links">
            <NavLink to="/" end>
              <HouseIcon size={20} /> Dashboard
            </NavLink>
            <NavLink to="/items">
              <ListBulletsIcon size={20} /> Items
            </NavLink>
            <NavLink to="/summary">
              <ChartBarIcon size={20} /> Summary
            </NavLink>
            <NavLink to="/tags">
              <TagIcon size={20} /> Tags
            </NavLink>
          </div>
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
  );
}