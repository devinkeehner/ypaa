# One Word at a Time

Public page: `/one-word-at-a-time`.

In Payload, open **Website → Daily word puzzles** and create a record:

- **Word:** 4–8 letters, without spaces or punctuation. Saved in uppercase.
- **Play date:** a calendar date in `YYYY-MM-DD` format. Dates are unique; each puzzle opens at midnight Eastern (America/New_York).

Saving a record schedules it automatically. There is no separate publish step. Use a YPAA or recovery-themed word; the board derives its length from the word. Avoid editing a word while it is playable, since editing resets saved progress on the next page load.

The game allows six guesses and accepts any letter combination of the required length, including fellowship acronyms. It saves guesses in the current browser and rechecks them on reload. Players can invite friends, copy results, or use native sharing where available. Results contain only the date, score, and colored squares.

Only authenticated CMS users can read the answer collection. The public page receives the date, word length, and puzzle identifier. Guess scoring runs on the server and only returns the answer after completion. This is a casual game with browser-local progress, not a competition with enforced player accounts or anti-cheat protection.

Add `/one-word-at-a-time` to the Header or Footer global to include it in your site's configured navigation. No initial puzzle records are seeded automatically. A day without a scheduled record shows a friendly empty state.

Validation: `npx tsx --test tests/wordle.test.ts` and `npx tsc --noEmit`.

The title visually replaces a crossed-out “day” with handwritten “word.” Purple indicates a correct position, apricot orange a misplaced letter, and pale gray a missed letter. Shared results use purple, orange, and white circles. The old `/wordle` address redirects permanently to `/one-word-at-a-time`; existing saved progress and collection records are preserved.

The game uses a deep plum background, warm off-white text, lavender correct tiles, apricot orange misplaced tiles, and pale gray missed tiles. Tile text uses dark ink for contrast on the bright result colors.

On phones the game fills the dynamic viewport, including safe-area padding. The title is compact, site registration bars and footer are hidden, and the board scales to the available space and word length. The keyboard stays visible, help and manual sharing use native dialogs, and landscape places the keyboard next to the board. After completion, the mobile keyboard gives way to result sharing. Extremely short viewports retain scrolling rather than clipping controls.

Mobile layout verified with a temporary local fixture at 320×568, 375×667, 390×844, and 844×390, including five- and eight-letter boards, letter entry, validation, and help open/close. No scheduled puzzle records were created for these checks.
