import express from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import { Expense } from '../models/Expense.js';
import { Income } from '../models/Income.js';
import { formatPaiseToRupees } from '../utils/money.js';

const router = express.Router();

router.get('/overview', requireAuth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);

  const [expenseTotals] = await Expense.aggregate([
    { $match: { user: userId } },
    {
      $facet: {
        total: [{ $group: { _id: null, totalPaise: { $sum: '$amountPaise' } } }],
        byCategory: [
          { $group: { _id: '$category', totalPaise: { $sum: '$amountPaise' } } },
          { $sort: { totalPaise: -1 } }
        ]
      }
    }
  ]);

  const [incomeTotals] = await Income.aggregate([
    { $match: { user: userId } },
    {
      $facet: {
        total: [{ $group: { _id: null, totalPaise: { $sum: '$amountPaise' } } }],
        byCategory: [
          { $group: { _id: '$category', totalPaise: { $sum: '$amountPaise' } } },
          { $sort: { totalPaise: -1 } }
        ]
      }
    }
  ]);

  const totalExpensePaise = expenseTotals?.total?.[0]?.totalPaise || 0;
  const totalIncomePaise = incomeTotals?.total?.[0]?.totalPaise || 0;
  const balancePaise = totalIncomePaise - totalExpensePaise;

  res.json({
    totals: {
      incomePaise: totalIncomePaise,
      income: formatPaiseToRupees(totalIncomePaise),
      expensePaise: totalExpensePaise,
      expense: formatPaiseToRupees(totalExpensePaise),
      balancePaise,
      balance: formatPaiseToRupees(balancePaise)
    },
    expenseByCategory: (expenseTotals?.byCategory || []).map(x => ({
      category: x._id,
      totalPaise: x.totalPaise,
      total: formatPaiseToRupees(x.totalPaise)
    })),
    incomeByCategory: (incomeTotals?.byCategory || []).map(x => ({
      category: x._id,
      totalPaise: x.totalPaise,
      total: formatPaiseToRupees(x.totalPaise)
    }))
  });
});

router.get('/monthly', requireAuth, async (req, res) => {
  const month = String(req.query.month || '').trim();
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: 'month must be in YYYY-MM format' });
  }

  const [y, m] = month.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));

  const userId = new mongoose.Types.ObjectId(req.userId);

  const expenseDaily = await Expense.aggregate([
    { $match: { user: userId, date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        totalPaise: { $sum: '$amountPaise' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const incomeDaily = await Income.aggregate([
    { $match: { user: userId, date: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        totalPaise: { $sum: '$amountPaise' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // merge into a single timeline for charting
  const map = new Map();
  for (const row of expenseDaily) map.set(row._id, { date: row._id, expensePaise: row.totalPaise, incomePaise: 0 });
  for (const row of incomeDaily) {
    const existing = map.get(row._id) || { date: row._id, expensePaise: 0, incomePaise: 0 };
    existing.incomePaise = row.totalPaise;
    map.set(row._id, existing);
  }

  const days = [...map.values()].sort((a, b) => a.date.localeCompare(b.date));

  res.json({
    month,
    days: days.map(d => ({
      ...d,
      expense: formatPaiseToRupees(d.expensePaise),
      income: formatPaiseToRupees(d.incomePaise)
    }))
  });
});

export default router;
