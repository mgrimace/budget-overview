import { useState, useEffect, useMemo } from 'react';
import { fetchCashflow, fetchBudgetItems } from '../api';
import type { BudgetItem, SankeyData } from '../types';
import { buildYearlySankeyData } from '../utils';
import BudgetDiagram from '../components/BudgetDiagram';
import UpcomingBillsSidebar from '../components/UpcomingBillsSidebar';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [monthlyData, setMonthlyData] = useState<SankeyData | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);

  useEffect(() => {
    fetchCashflow().then(setMonthlyData);
    fetchBudgetItems().then(setBudgetItems);
  }, []);

  const yearlyData = useMemo(() => buildYearlySankeyData(budgetItems), [budgetItems]);
  const data = viewMode === 'monthly' ? monthlyData : yearlyData;

  return (
    <>
      <h1 className="dashboard-title">Budget</h1>
      <div className="dashboard-controls">
        <div className="btn-group">
          <button
            className={`btn ${viewMode === 'monthly' ? 'active' : ''}`}
            onClick={() => setViewMode('monthly')}
          >
            Monthly
          </button>
          <button
            className={`btn ${viewMode === 'yearly' ? 'active' : ''}`}
            onClick={() => setViewMode('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="dashboard">
        <div className="dashboard-main">
          {data && data.nodes.length > 0 ? (
            <BudgetDiagram data={data} />
          ) : (
            <div className="empty-state">
              <p>No budget items yet. Add income and expenses to see your {viewMode} budget.</p>
            </div>
          )}
        </div>
        <UpcomingBillsSidebar />
      </div>
    </>
  );
}