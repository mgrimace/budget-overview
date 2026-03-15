import { useState, useEffect } from 'react';
import { fetchCashflow } from '../api';
import type { SankeyData } from '../types';
import CashflowDiagram from '../components/CashflowDiagram';
import UpcomingBillsSidebar from '../components/UpcomingBillsSidebar';

export default function Dashboard() {
  const [data, setData] = useState<SankeyData | null>(null);

  useEffect(() => {
    fetchCashflow().then(setData);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <h1>Monthly Cash Flow</h1>
        {data && data.nodes.length > 0 ? (
          <CashflowDiagram data={data} />
        ) : (
          <div className="empty-state">
            <p>No budget items yet. Add income and expenses to see your cash flow.</p>
          </div>
        )}
      </div>
      <UpcomingBillsSidebar />
    </div>
  );
}
