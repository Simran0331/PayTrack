import express from 'express';
import { z } from 'zod';
import { Expense } from '../models/Expense.js';
import { requireAuth } from '../middleware/auth.js';
import { parseRupeesToPaise, formatPaiseToRupees } from '../utils/money.js';

const router = express.Router();

const createExpenseSchema = z.object({
  amount: z.union([z.string(), z.number()]),
  category: z.string().min(1).max(60),
  description: z.string().min(1).max(240),
  date: z.union([z.string(), z.number(), z.date()])
});

router.post('/', requireAuth, async (req, res) => {
  const idempotencyKey = req.header('Idempotency-Key');
  if (!idempotencyKey) return res.status(400).json({ error: 'Missing Idempotency-Key header' });

  try {
    const { amount, category, description, date } = createExpenseSchema.parse(req.body);
    const amountPaise = parseRupeesToPaise(amount);

    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid date' });

    const doc = await Expense.create({
      user: req.userId,
      amountPaise,
      category,
      description,
      date: d,
      idempotencyKey
    });

    return res.status(201).json({
      item: {
        id: doc._id,
        amountPaise: doc.amountPaise,
        amount: formatPaiseToRupees(doc.amountPaise),
        category: doc.category,
        description: doc.description,
        date: doc.date,
        createdAt: doc.createdAt
      },
      replay: false
    });
  } catch (e) {
    // Duplicate key => retry of same idempotency key.
    if (e?.code === 11000) {
      const existing = await Expense.findOne({ user: req.userId, idempotencyKey }).lean();
      if (!existing) return res.status(409).json({ error: 'Duplicate request' });
      return res.status(200).json({
        item: {
          id: existing._id,
          amountPaise: existing.amountPaise,
          amount: formatPaiseToRupees(existing.amountPaise),
          category: existing.category,
          description: existing.description,
          date: existing.date,
          createdAt: existing.createdAt
        },
        replay: true
      });
    }

    const msg = e?.issues ? e.issues.map(i => i.message).join(', ') : e.message;
    return res.status(400).json({ error: msg });
  }
});

router.get('/', requireAuth, async (req, res) => {
  const { category, sort } = req.query;
  const filter = { user: req.userId };
  if (category) filter.category = String(category);

  let sortObj = { date: -1, createdAt: -1 };
  if (sort && String(sort) !== 'date_desc') sortObj = { createdAt: -1 };

  const items = await Expense.find(filter).sort(sortObj).lean();
  const totalPaise = items.reduce((sum, x) => sum + (x.amountPaise || 0), 0);

  res.json({
    items: items.map(x => ({
      id: x._id,
      amountPaise: x.amountPaise,
      amount: formatPaiseToRupees(x.amountPaise),
      category: x.category,
      description: x.description,
      date: x.date,
      createdAt: x.createdAt
    })),
    meta: {
      count: items.length,
      totalPaise,
      total: formatPaiseToRupees(totalPaise)
    }
  });
});

export default router;
