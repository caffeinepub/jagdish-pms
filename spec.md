# Jagdish PMS

## Current State
The app has a version switcher with Classic and Advanced versions. The sidebar shows different nav items based on version. There is no broker/AMC/distributor-wise data entry feature yet.

## Requested Changes (Diff)

### Add
- New version "Elite" (v3) added to VERSIONS array in VersionContext.tsx
- New page: `DistributorEntry.tsx` — available only in Elite version
- The page has 4 tabs: **Broker**, **AMC**, **National Distributor**, **Sum**
- In each of the first 3 tabs, users can add rows: name (e.g. Zerodha, SBI MF, NJ Wealth) + invested amount (INR)
- The **Sum** tab shows a combined total from all three categories (Broker total, AMC total, Distributor total, Grand Total)
- Data is stored in React state (no backend needed — this is a local entry form)
- Sidebar shows "Distributor Entry" nav item only when version is "elite"
- App.tsx routes to new page

### Modify
- `VersionContext.tsx`: add Elite version entry (id: "elite", label: "Elite", badge: "v3")
- `Sidebar.tsx`: add `distributor-entry` nav item with `eliteOnly` flag
- `App.tsx`: add `distributor-entry` page to pageComponents map
- `Sidebar.tsx`: filter logic to show eliteOnly items when selectedVersion === "elite"

### Remove
- Nothing removed

## Implementation Plan
1. Update VersionContext to add Elite version
2. Create `src/frontend/src/pages/DistributorEntry.tsx` with 4 tabs (Broker, AMC, National Distributor, Sum)
   - Each data tab: table with Name + Amount columns, Add Row button, Delete row button
   - Pre-populate with common names (Zerodha, Groww, HDFC Securities for Broker; SBI MF, HDFC MF, ICICI Prudential for AMC; NJ Wealth, Prudent for Distributor)
   - Sum tab: shows subtotal per category and grand total
3. Update Sidebar to include distributor-entry item (eliteOnly)
4. Update App.tsx to render DistributorEntry page
