import type { CollectionConfig } from 'payload';
import { validPlayDate } from '../lib/wordle';

export const WordlePuzzles: CollectionConfig = {
  slug: 'wordle-puzzles',
  labels: { singular: 'Daily word puzzle', plural: 'Daily word puzzles' },
  admin: { group: 'Website', useAsTitle: 'word', defaultColumns: ['word', 'playDate'], description: 'Schedule One Word at a Time at /one-word-at-a-time. One puzzle per Eastern calendar date.' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user) && !('role' in (req.user || {}) && (req.user as { role?: string }).role === 'viewer'),
    update: ({ req }) => Boolean(req.user) && !('role' in (req.user || {}) && (req.user as { role?: string }).role === 'viewer'),
    delete: ({ req }) => Boolean(req.user) && !('role' in (req.user || {}) && (req.user as { role?: string }).role === 'viewer'),
  },
  defaultSort: '-playDate',
  fields: [
    { name: 'readingTitle', label: 'Before-play reading title', type: 'text', admin: { description: 'Optional title for the reading shown before this day’s puzzle.' } },
    { name: 'readingPassage', label: 'Before-play passage', type: 'textarea', admin: { description: 'Enter your own reading or text you have permission to reproduce. Paragraph breaks are preserved. If blank, players see a link to AA’s Daily Reflections.' } },
    { name: 'readingAttribution', label: 'Reading attribution', type: 'text', admin: { description: 'Source, author, page, and any required copyright notice.' } },
    { name: 'word', type: 'text', required: true, hooks: { beforeValidate: [({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value] }, validate: (value: unknown) => typeof value === 'string' && /^[A-Z]{4,8}$/.test(value) || 'Enter 4–8 letters, without spaces or punctuation.', admin: { description: 'A YPAA or recovery-themed word. The board adapts to its length.' } },
    { name: 'playDate', label: 'Play date', type: 'text', required: true, unique: true, index: true, validate: (value: unknown) => validPlayDate(value) || 'Enter a real date as YYYY-MM-DD.', admin: { placeholder: '2026-09-10', description: 'YYYY-MM-DD. Opens at midnight America/New_York. Only one word can be scheduled per date.' } },
  ],
};
