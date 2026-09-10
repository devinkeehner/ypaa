# YPAA Wordle

Public page: `/wordle`.

In Payload, open **Website → Wordle puzzles** and create a record:

- **Word:** 4–8 letters, without spaces or punctuation. Saved in uppercase.
- **Play date:** a calendar date in `YYYY-MM-DD` format. Dates are unique; each puzzle opens at midnight Eastern (America/New_York).

Saving a record schedules it automatically. There is no separate publish step. Use a YPAA or recovery-themed word; the board derives its length from the word. Avoid editing a word while it is playable, since editing resets saved progress on the next page load.

The game allows six guesses and accepts any letter combination of the required length, including fellowship acronyms. It saves guesses in the current browser and rechecks them on reload. Players can invite friends, copy results, or use native sharing where available. Results contain only the date, score, and colored squares.

Only authenticated CMS users can read the answer collection. The public page receives the date, word length, and puzzle identifier. Guess scoring runs on the server and only returns the answer after completion. This is a casual game with browser-local progress, not a competition with enforced player accounts or anti-cheat protection.

Add `/wordle` to the Header or Footer global to include it in your site's configured navigation. No initial puzzle records are seeded automatically. A day without a scheduled record shows a friendly empty state.

Validation: `npx tsx --test tests/wordle.test.ts` and `npx tsc --noEmit`.
