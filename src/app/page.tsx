import { getTransactions, getBudgets } from '../actions/transactionActions';
import MainView from './MainView';

export default async function Page({ searchParams }: { searchParams: { monthYear?: string } }) {
  // Determine monthYear from URL or default to current
  const now = new Date();
  const currentMonth = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  const activeMonthYear = searchParams.monthYear || currentMonth;

  // Fetch from DB
  const transactions = await getTransactions(activeMonthYear);
  const budgets = await getBudgets(activeMonthYear);

  return (
    <MainView 
      initialTransactions={transactions} 
      budgets={budgets}
      activeMonthYear={activeMonthYear} 
    />
  );
}
