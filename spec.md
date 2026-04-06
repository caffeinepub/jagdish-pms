# Jagdish PMS

## Current State
- Holdings/Transactions form has AMC → Category → Fund Name → Type cascading dropdowns
- The 4 seed funds in App.tsx have no `amc` or `fundType` fields (stored as empty strings)
- The cascade filters funds by `f.amc === selectedAmc`, so selecting any real AMC name always returns 0 results, making Category/Fund Name dropdowns empty
- Dashboard performance trend chart uses `Math.random()` to generate fake data
- No comprehensive Indian mutual fund data exists — admin must manually add every fund before any user can record a transaction

## Requested Changes (Diff)

### Add
- Comprehensive pre-seeded Indian mutual fund list covering all major AMCs (HDFC, SBI, ICICI Prudential, Nippon India, Axis, Mirae Asset, Kotak, DSP, PPFAS, UTI, Motilal Oswal, Tata) and all categories (equity, debt, hybrid, elss) with proper `amc` and `fundType` fields
- Realistic performance trend on Dashboard based on actual transaction data (invested amount vs current value progression), not random numbers

### Modify
- `SEED_FUNDS` in App.tsx: expand from 4 to ~50+ funds with correct `amc` and `fundType` fields; change seed logic to seed missing funds by ID (not just when count is 0)
- Dashboard `trendData`: replace `Math.random()` with deterministic progression from invested amount to current value across the days

### Remove
- Math.random() in Dashboard trendData

## Implementation Plan
1. Expand SEED_FUNDS in App.tsx with 50+ real Indian MF names, each with proper amc, category, fundType fields
2. Update seed logic to check by fund ID (seed any missing fund, not just when count=0), but only for admin users
3. Fix Dashboard trendData to use deterministic interpolation between invested and current value
