# Jagdish PMS

## Current State
Favorites are implemented as quick-pick pill buttons above the cascading fund selector (AMC → Category → MF Name → Type). Clicking a pill fills all four cascade dropdowns at once.

## Requested Changes (Diff)

### Add
- A proper "Favorites" `<Select>` dropdown as the fifth/top entry point in the fund selector, placed above the four cascade dropdowns.

### Modify
- Replace the favorites pills row with a labeled `<Select>` dropdown showing only the user's starred funds.
- The dropdown shows a placeholder "No favorites yet — star a fund below" when empty, and "Select a favorite fund..." when funds are starred.
- Selecting a fund from the Favorites dropdown fills all four cascade dropdowns (AMC, Category, Name, Type) and sets fundId — same behavior as the old pills.
- Each option in the dropdown shows the fund name + fund type badge.

### Remove
- The pills/button row for favorites.

## Implementation Plan
1. In Transactions.tsx, replace the favorites pills block with a `<Select>` / `<SelectTrigger>` / `<SelectContent>` dropdown.
2. Reuse the existing `handleSelectFavorite` handler on `onValueChange`.
3. Keep star toggle buttons inside the Step 3 (Fund Name) dropdown unchanged — users still star funds from there.
