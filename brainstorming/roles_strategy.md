# Enterprise Roles & System Architecture Strategy v2.0

Transformasi arsitektur menjadi **Dual-Core Routing**: `/app` (Client Side) dan `/system` (Operation Side). Dokumen ini memperdalam spesifikasi role, permission, dan ekosistem dashboard.

## 1. The Dual-Core Architecture

Sistem akan dibagi secara radikal menjadi dua semesta terpisah untuk menjaga keamanan dan fokus konteks.

### 🔵 Universe A: The Product (`/app`)
*Target User: Merchant, Business Owner, Store Manager*
*   **Focus**: Utility, Productivity, Daily Operations.
*   **Authentication**: User Email/Pass (Future: Phone/OTP).
*   **Entry Point**: `app.margins.pro` or `margins.pro/app`.

### 🔴 Universe B: The System (`/system`)
*Target User: Super Admin, Internal Staff, Analyst, Affiliates*
*   **Focus**: Control, Monitoring, Growth, Governance.
*   **Authentication**: Strict Auth (2FA recommended for internal).
*   **Entry Point**: `sys.margins.pro` or `margins.pro/system`.

---

## 2. Expanded Role Hierarchy (The "System" Universe)

Semua role di bawah ini masuk melalui gerbang `/system`, namun UI yang mereka lihat akan berbeda drastis (Hybrid UI Rendering).

### **Level 1: The Gods (Core Control)**
*Access Route: `/system/admin`*

1.  **Super Admin (Root)**
    *   **Clearance**: Level 0 (Highest).
    *   **Capabilities**:
        *   *Nuclear Access*: Delete users, reset database, raw SQL query.
        *   *Config Master*: Ubah global variable (Tax, Pricing) yang berdampak ke seluruh user `/app`.
        *   *Role Management*: Promote/Demote staff.
    *   **Dashboard**: **Master Command Center** (Full Control + System Health + Audit Logs).

2.  **Support Specialist**
    *   **Clearance**: Level 1.
    *   **Capabilities**:
        *   *Ghost Mode*: Masuk ke akun merchant di `/app` via `/system` tanpa password (untuk debugging).
        *   *Ticket Ops*: Refund transaction, manual subscription extension.
    *   **Dashboard**: **Support Console** (User Search, Ticket Queue, Activity Feed).

### **Level 2: The Brains (Growth & Intel)**
*Access Route: `/system/intelligence`*

3.  **Chief Growth Officer (CGO) / Marketing Manager**
    *   **Clearance**: Level 2.
    *   **Capabilities**:
        *   *Campaign Ops*: Generate promo codes, set affiliate commissions.
        *   *User Outreach*: Broadcast email/notif ke segmen user tertentu.
    *   **Dashboard**: **Marketing HQ** (Campign Performance metrics, Conversion Funnels).

4.  **Data Analyst**
    *   **Clearance**: Level 2 (Read-Only Strong).
    *   **Capabilities**:
        *   *Data Mining*: Akses ke anonymized data user untuk analisis tren.
        *   *Export*: Download CSV/JSON dataset besar.
    *   **Dashboard**: **Intelligence Hub** (SaaS Metrics: MRR, ARR, Churn, LTV, CAC).

### **Level 3: The Partners (External Force)**
*Access Route: `/system/partners`*

5.  **Affiliate Partner**
    *   **Clearance**: Level 3 (External).
    *   **Capabilities**:
        *   *Referral Ops*: Generate tracking links.
        *   *Payout*: Request withdrawal komisi.
    *   **Dashboard**: **Affiliate Portal** (Simple UI: Wallet, Link Gen, Leaderboard).

---

## 3. Detailed Dashboard Specifications

### A. `/system/intelligence` (The War Room)
Dashboard ini harus terlihat "futuristik" dan data-heavy. Bukan untuk config, tapi untuk **insight**.
*   **Visual Components**:
    *   **The World Map**: Heatmap real-time lokasi login user.
    *   **The Pulse**: Stream live feed "User X just upgraded to Pro", "User Y created a project".
    *   **Churn Radar**: AI Probabilistic model listing user yang berpotensi churn minggu depan >80%.
    *   **Revenue Flow**: Sankey Diagram arus uang masuk (Stripe/Midtrans -> Net Revenue).

### B. `/system/partners` (The Growth Engine)
Harus mobile-friendly karena affiliate sering cek dari HP.
*   **Visual Components**:
    *   **"Share Now" Cards**: Kartu grafis siap share ke IG Story/WhatsApp dengan kode referral tertanam.
    *   **Commision Tier Bar**: Progress bar "Referred 50 more to unlock 25% commission".
    *   **Leaderboard**: Gamification "Top Affiliate of the Month".

---

## 4. Technical Implementation: Granular Permissions

Database `users` akan memiliki colom `role` dan `permission_flags` (JSON/Bitmask).

**Bitmask Permission Example:**
```typescript
const PERMISSIONS = {
  CAN_VIEW_REVENUE: 1 << 0, // 1
  CAN_EDIT_USERS:   1 << 1, // 2
  CAN_GHOST_LOGIN:  1 << 2, // 4
  CAN_CONFIG_SYS:   1 << 3, // 8
  CAN_WITHDRAW_AFF: 1 << 4, // 16
};

// Example Roles:
// Super Admin = All Bits (31)
// Analyst = CAN_VIEW_REVENUE (1)
// Support = CAN_EDIT_USERS | CAN_GHOST_LOGIN (6)
```

## 5. Next Execution Steps
1.  **Refactor Routing**: Setup `React Router` untuk handle `/system/*` dengan layout terpisah (Dark Mode Default for System?).
2.  **DB Migration**: Tambah kolom `role`, `permissions` (JSON), `referral_code`, `referred_by` ke tabel `users`.
3.  **Middleware**: Buat Hono Middleware `requirePermission(PERMISSIONS.CAN_CONFIG_SYS)` untuk proteksi API endpoint.
