# Jagdish PMS

## Current State
The `isCallerAdmin` query function is declared in the backend DID interface and TypeScript types, but is missing from the actual Motoko backend code (`main.mo`). This causes the frontend's `useIsCallerAdmin` hook to call a non-existent function, resulting in the admin check silently failing. Since `isAdmin` is always falsy, the Add Fund button in Holdings is never shown to any user (even real admins).

## Requested Changes (Diff)

### Add
- `isCallerAdmin` public query function in `main.mo` that returns `true` if the caller is an admin, `false` otherwise (including anonymous callers)

### Modify
- Nothing else changes

### Remove
- Nothing

## Implementation Plan
1. Insert `isCallerAdmin` query function into `main.mo` after `bootstrapFirstAdmin` -- already done via sed
