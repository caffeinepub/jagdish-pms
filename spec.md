# Jagdish PMS

## Current State
Admin panel has tabs for blog management (Posts, Scheduled Posts, Tags & Categories, Pages), Data Export, and Settings. Admin can export all user data as CSV but cannot view individual user portfolios or login activity in the UI.

## Requested Changes (Diff)

### Add
- New "Users" tab in Admin Panel sidebar
- Backend: record `lastSeen` timestamp on every user session open
- Backend: admin API to get all users with summary stats (principal, gmail, registeredAt, lastSeen, totalInvested, transactionCount)
- Backend: admin API to get full portfolio for a specific user (transactions, holdings, capital gains)
- Frontend: Users tab with top stat cards (Total Users, Active Today, Active Last 7 Days, New This Week)
- Frontend: User list table with columns: User, Gmail, Registered On, Last Active, Total Invested, Transactions, and an expand/drill button
- Frontend: Drill-down view per user showing their full transactions list, holdings summary, and capital gains -- read-only

### Modify
- Backend: update session registration to record lastSeen timestamp on every call
- Admin Panel sidebar: add Users tab with people icon

### Remove
- Nothing removed

## Implementation Plan
1. Update backend to store and update `lastSeen` per user on registerUser call
2. Add `getAdminUserList` backend function returning all users with summary stats (admin-only)
3. Add `getAdminUserPortfolio` backend function returning full portfolio for a given principal (admin-only)
4. Add Users tab to Admin Panel with stat cards and user table
5. Add drill-down modal/expandable view per user with transactions, holdings, capital gains
