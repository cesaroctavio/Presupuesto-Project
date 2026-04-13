import { pgTable, serial, text, real, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  concept: text('concept').notNull(),
  amount: real('amount').notNull(),
  type: text('type').notNull(), // 'ingresos', 'ahorros', 'bills', 'tdc'
  quincena: integer('quincena').notNull(), // 1 or 2
  monthYear: text('month_year').notNull(), // e.g. "04-2026"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  category: text('category').notNull(), // 'bills', 'tdc', etc
  amount: real('amount').notNull(),
  monthYear: text('month_year').notNull(), // "04-2026"
}, (table) => {
  return {
    uq_budget: uniqueIndex('uq_category_month_year').on(table.category, table.monthYear),
  };
});
