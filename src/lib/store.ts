import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  tags?: string[];
  recurring?: boolean;
  recurrenceType?: "weekly" | "monthly" | "yearly";
  completed?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  month: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description?: string;
}

export interface Settings {
  currency: string;
  theme: "light" | "dark";
  categories: string[];
  tags: string[];
  notifications: {
    summaries: boolean;
    billReminders: boolean;
    goalReminders: boolean;
  };
}

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  settings: Settings;
  currentMonth: string;
}

interface FinanceActions {
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  toggleTransactionComplete: (id: string) => void;

  addBudget: (budget: Omit<Budget, "id">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;

  addGoal: (goal: Omit<Goal, "id">) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  updateSettings: (settings: Partial<Settings>) => void;
  setCurrentMonth: (month: string) => void;
}

interface FinanceStore extends FinanceState {
  actions: FinanceActions;
}

// Get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

// Dummy data
const dummyTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 150000,
    category: "Salary",
    description: "Monthly salary",
    date: `${getCurrentMonth()}-01`,
    tags: ["work"],
    completed: true,
  },
  {
    id: "2",
    type: "expense",
    amount: 25000,
    category: "Food",
    description: "Groceries",
    date: `${getCurrentMonth()}-02`,
    tags: ["essential"],
    completed: false,
  },
  {
    id: "3",
    type: "expense",
    amount: 15000,
    category: "Transport",
    description: "Fuel",
    date: `${getCurrentMonth()}-03`,
    tags: ["transport"],
    completed: true,
  },
  {
    id: "4",
    type: "expense",
    amount: 8000,
    category: "Entertainment",
    description: "Movie tickets",
    date: `${getCurrentMonth()}-04`,
    tags: ["leisure"],
    completed: false,
  },
];

const dummyBudgets: Budget[] = [
  {
    id: "1",
    category: "Food",
    amount: 40000,
    spent: 25000,
    month: getCurrentMonth(),
  },
  {
    id: "2",
    category: "Transport",
    amount: 20000,
    spent: 15000,
    month: getCurrentMonth(),
  },
  {
    id: "3",
    category: "Entertainment",
    amount: 15000,
    spent: 8000,
    month: getCurrentMonth(),
  },
  {
    id: "4",
    category: "Utilities",
    amount: 25000,
    spent: 0,
    month: getCurrentMonth(),
  },
];

const dummyGoals: Goal[] = [
  {
    id: "1",
    name: "Emergency Fund",
    targetAmount: 500000,
    currentAmount: 150000,
    deadline: "2024-12-31",
    description: "6 months of expenses",
  },
  {
    id: "2",
    name: "Vacation",
    targetAmount: 200000,
    currentAmount: 75000,
    deadline: "2024-08-15",
    description: "Trip to Dubai",
  },
];

// ⬇️ not exported, so that no one can subscribe to the entire store
const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: dummyTransactions,
      budgets: dummyBudgets,
      goals: dummyGoals,
      currentMonth: getCurrentMonth(),
      settings: {
        currency: "NGN",
        theme: "light",
        categories: [
          "Food",
          "Transport",
          "Entertainment",
          "Utilities",
          "Healthcare",
          "Shopping",
          "Salary",
          "Freelance",
        ],
        tags: ["essential", "leisure", "work", "transport", "health"],
        notifications: {
          summaries: true,
          billReminders: true,
          goalReminders: true,
        },
      },

      // ⬇️ separate "namespace" for actions
      actions: {
        addTransaction: (transaction) => {
          const newTransaction = {
            ...transaction,
            id: Date.now().toString(),
            completed: false,
          };
          set((state) => ({
            transactions: [...state.transactions, newTransaction],
          }));
        },

        updateTransaction: (id, transaction) => {
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...t, ...transaction } : t
            ),
          }));
        },

        deleteTransaction: (id) => {
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
          }));
        },

        toggleTransactionComplete: (id) => {
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
          }));
        },

        addBudget: (budget) => {
          const newBudget = {
            ...budget,
            id: Date.now().toString(),
          };
          set((state) => ({
            budgets: [...state.budgets, newBudget],
          }));
        },

        updateBudget: (id, budget) => {
          set((state) => ({
            budgets: state.budgets.map((b) =>
              b.id === id ? { ...b, ...budget } : b
            ),
          }));
        },

        addGoal: (goal) => {
          const newGoal = {
            ...goal,
            id: Date.now().toString(),
          };
          set((state) => ({
            goals: [...state.goals, newGoal],
          }));
        },

        updateGoal: (id, goal) => {
          set((state) => ({
            goals: state.goals.map((g) =>
              g.id === id ? { ...g, ...goal } : g
            ),
          }));
        },

        deleteGoal: (id) => {
          set((state) => ({
            goals: state.goals.filter((g) => g.id !== id),
          }));
        },

        updateSettings: (settings) => {
          set((state) => ({
            settings: { ...state.settings, ...settings },
          }));
        },

        setCurrentMonth: (month) => {
          set({ currentMonth: month });
        },
      },
    }),
    {
      name: "finance-store",
    }
  )
);

// 💡 exported - consumers don't need to write selectors
export const useTransactions = () =>
  useFinanceStore((state) => state.transactions);
export const useBudgets = () => useFinanceStore((state) => state.budgets);
export const useGoals = () => useFinanceStore((state) => state.goals);
export const useSettings = () => useFinanceStore((state) => state.settings);
export const useCurrentMonth = () =>
  useFinanceStore((state) => state.currentMonth);

// 🎉 one selector for all our actions
export const useFinanceActions = () =>
  useFinanceStore((state) => state.actions);
