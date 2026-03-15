import { useState, useEffect } from 'react';
import { fetchUpcomingBills } from '../api';
import type { UpcomingBill } from '../types';
import { CalendarBlank } from '@phosphor-icons/react';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function UpcomingBillsSidebar() {
  const [bills, setBills] = useState<UpcomingBill[]>([]);

  useEffect(() => {
    fetchUpcomingBills().then(setBills);
  }, []);

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const nextMonth = (currentMonth + 1) % 12;

  const sorted = [...bills].sort((a, b) => {
    const aUpcoming = a.day_of_month >= currentDay;
    const bUpcoming = b.day_of_month >= currentDay;
    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;
    return a.day_of_month - b.day_of_month;
  });

  return (
    <aside className="sidebar">
      <h2>
        <CalendarBlank size={22} /> Upcoming Bills
      </h2>
      {sorted.length === 0 ? (
        <p className="empty-state">No upcoming bills.</p>
      ) : (
        <ul className="bills-list">
          {sorted.map((bill, i) => {
            const isPast = bill.day_of_month < currentDay;
            const month = isPast ? MONTH_NAMES[nextMonth] : MONTH_NAMES[currentMonth];
            return (
              <li key={i} className={`bill-item ${isPast ? 'next-month' : ''}`}>
                <span className="bill-date">
                  {month} {bill.day_of_month}
                </span>
                <span className="bill-name">{bill.name}</span>
                <span className="bill-amount">${bill.amount.toFixed(2)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
