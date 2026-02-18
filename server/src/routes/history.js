import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Expense } from '../models/Expense.js';
import { Income } from '../models/Income.js';
import { formatPaiseToRupees } from '../utils/money.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 200), 500);

  const [expenses, incomes] = await Promise.all([
    Expense.find({ user: req.userId }).sort({ date: -1, createdAt: -1 }).limit(limit).lean(),
    Income.find({ user: req.userId }).sort({ date: -1, createdAt: -1 }).limit(limit).lean()
  ]);

  const merged = [
    ...expenses.map(x => ({
      type: 'expense',
      id: x._id,
      amountPaise: x.amountPaise,
      amount: formatPaiseToRupees(x.amountPaise),
      category: x.category,
      description: x.description,
      date: x.date,
      createdAt: x.createdAt
    })),
    ...incomes.map(x => ({
      type: 'income',
      id: x._id,
      amountPaise: x.amountPaise,
      amount: formatPaiseToRupees(x.amountPaise),
      category: x.category,
      description: x.description,
      date: x.date,
      createdAt: x.createdAt
    }))
  ].sort((a, b) => {
    const d = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (d !== 0) return d;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  res.json({ items: merged.slice(0, limit) });
});

export default router;
