import { useState, useEffect } from 'react';
import { fetchCashflow } from '../api';
import type { SankeyData } from '../types';
import BudgetDiagram from '../components/BudgetDiagram';
import UpcomingBillsSidebar from '../components/UpcomingBillsSidebar';

export default function Dashboard() {
  const [data, setData] = useState<SankeyData | null>(null);

  useEffect(() => {
    fetchCashflow().then(setData);
  }, []);

  return (
    <>
      <h1 className="dashboard-title">Monthly Budget</h1>
      <div className="dashboard">
        <div className="dashboard-main">
          {data && data.nodes.length > 0 ? (
            <BudgetDiagram data={data} />
          ) : (
            <div className="empty-state">
              <p>No budget items yet. Add income and expenses to see your monthly budget.</p>
            </div>
          )}
        </div>
        <UpcomingBillsSidebar />
      </div>
    </>
  );
}