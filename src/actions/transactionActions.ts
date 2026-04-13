'use server';

import { db } from '../db';
import { transactions, budgets } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getTransactions(monthYear: string) {
  try {
    const data = await db.select().from(transactions).where(eq(transactions.monthYear, monthYear));
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function addTransaction(data: {
  concept: string;
  amount: number;
  type: string;
  quincena: number;
  monthYear: string;
}) {
  try {
    await db.insert(transactions).values(data);
    revalidatePath('/');
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw new Error('Failed to add transaction');
  }
}

export async function updateTransaction(id: number, data: Partial<{
  concept: string;
  amount: number;
  type: string;
  quincena: number;
  monthYear: string;
}>) {
  try {
    await db.update(transactions).set(data).where(eq(transactions.id, id));
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Failed to update transaction');
  }
}

export async function deleteTransaction(id: number) {
  try {
    await db.delete(transactions).where(eq(transactions.id, id));
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Failed to delete transaction');
  }
}

export async function getBudgets(monthYear: string) {
  try {
    return await db.select().from(budgets).where(eq(budgets.monthYear, monthYear));
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
}

export async function setBudget(category: string, amount: number, monthYear: string) {
  try {
    // Upsert budget
    const existing = await db.select().from(budgets).where(and(eq(budgets.category, category), eq(budgets.monthYear, monthYear)));
    if (existing.length > 0) {
      await db.update(budgets).set({ amount }).where(eq(budgets.id, existing[0].id));
    } else {
      await db.insert(budgets).values({ category, amount, monthYear });
    }
    revalidatePath('/');
  } catch (error) {
    console.error('Error setting budget:', error);
    throw new Error('Failed to set budget');
  }
}
