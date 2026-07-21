# PharmaCare — Pharmacy Management System

A professional, high-fidelity web application built to help pharmacists manage daily pharmacy operations efficiently.

## Core Features & Modules Built

1. **Dashboard** — Real-time metrics for today's sales revenue, active warning alerts for low-stock and expiring items, recent transactions, and custom SVG daily charts.
2. **Medicine Management** — Full catalog CRUD operations, barcode tracking, batch numbers, custom expiry alerts, and profit margin estimation.
3. **Sales POS Terminal** — Instant cart additions, physician prescription attachment, custom discounts, and a printable receipt module overlay.
4. **Inventory Auditing** — Stock level monitoring, manual adjustments ledger, and timestamped audit logs.
5. **Supplier Portal** — procurement PO invoicing, supplier profiles registry, and debt outstanding payments tracking.
6. **Customer CRM** — Patient registry with phone numbers, loyalty points tracker, and sales logs.
7. **Prescriptions** — Dispensing verification logs linked to POS transactions.
8. **Reports** — Period reports (Daily/Weekly/Monthly), margin profit audits, and best-selling drug graphs.
9. **User Management** — Multi-role access levels (Admin, Pharmacist, Cashier) with distinct navigation menus.
10. **Settings** — Pharmacy profile edits, tax rates config, and backup export/restore functions.

---

## Folder Architecture

```
pharmacy-system/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── data/
│       │   └── mockData.ts
│       └── components/
│           ├── Sidebar.tsx
│           ├── DashboardView.tsx
│           ├── MedicineView.tsx
│           ├── SalesPOSView.tsx
│           ├── InventoryView.tsx
│           ├── SuppliersView.tsx
│           ├── CustomersView.tsx
│           ├── PrescriptionsView.tsx
│           ├── ReportsView.tsx
│           ├── UserManagementView.tsx
│           └── SettingsView.tsx
└── backend/
    ├── package.json
    ├── server.js
    └── schema.sql
```

---

## Setup & Run Instructions

You can run both the frontend and backend with a single command from the project root!

### 1. Install all dependencies
Run this command from the root directory to install dependencies for the root, frontend, and backend:
```bash
npm run install:all
```

### 2. Start both Frontend & Backend
Run this command to boot up both servers concurrently:
```bash
npm start
```
- **Frontend** will start on: [http://localhost:3000](http://localhost:3000)
- **Backend API** will start on: [http://localhost:5000](http://localhost:5000)


---

## Demo Login Credentials

You can sign in using any of the following accounts (use any password to log in):

| Role | Email Address | Access Level |
|------|---------------|--------------|
| **Admin** | `jane@pharmacy.com` | Unlimited operational & settings edit access |
| **Pharmacist** | `mark@pharmacy.com` | Medicines, POS, Inventory, Suppliers & Prescriptions |
| **Cashier** | `lucy@pharmacy.com` | Restricted to Sales POS checkout & Customer profiles |
# Pharmacy-System
