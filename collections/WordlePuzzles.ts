import type { CollectionConfig } from 'payload';
import { validPlayDate } from '../lib/wordle';

export const WordlePuzzles: CollectionConfig = {
  slug: 'wordle-puzzles',
  labels: { singular: 'Wordle puzzle', plural: 'Wordle puzzles' },
  admin: { group: 'Website', useAsTitle: 'word', defaultColumns: ['word', 'playDate'], description: 'Schedule the daily YPAA Wordle at /wordle. One puzzle per Eastern calendar date.' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user) && !('role' in (req.user || {}) && (req.user as { role?: string }).role === 'viewer'),
    update: ({ req }) => Boolean(req.user) && !('role' in (req.user || {}) && (req.user as { role?: string }).role === 'viewer'),
    delete: ({ req }) => Boolean(req.user) && !('role' in (req.user || {}) && (req.user as { role?: string }).role === 'viewer'),
  },
  defaultSort: '-playDate',
  fields: [
    { name: 'word', type: 'text', required: true, hooks: { beforeValidate: [({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value] }, validate: (value: unknown) => typeof value === 'string' && /^[A-Z]{4,8}$/.test(value) || 'Enter 4–8 letters, without spaces or punctuation.', admin: { description: 'A YPAA or recovery-themed word. The board adapts to its length.' } },
    { name: 'playDate', label: 'Play date', type: 'text', required: true, unique: true, index: true, validate: (value: unknown) => validPlayDate(value) || 'Enter a real date as YYYY-MM-DD.', admin: { placeholder: '2026-09-10', description: 'YYYY-MM-DD. Opens at midnight America/New_York. Only one word can be scheduled per date.' } },
  ],
};
