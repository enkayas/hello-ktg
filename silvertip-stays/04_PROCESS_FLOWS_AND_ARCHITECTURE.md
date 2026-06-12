# Process Flows & System Architecture

**Document Type**: Technical Reference  
**Audience**: Developers, System Admins, Power Users  

---

## Table of Contents

1. [Data Flow Architecture](#data-flow-architecture)
2. [User Journey Flows](#user-journey-flows)
3. [System Integration Flows](#system-integration-flows)
4. [Module Interaction Map](#module-interaction-map)
5. [Decision Trees](#decision-trees)

---

## Data Flow Architecture

### **Overall System Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                   Silvertip Ventures App                         │
│                   (TanStack Start + React)                       │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
        ┌────────▼──────────┐          ┌─────────▼──────────┐
        │  Frontend Layer   │          │  Backend/API Layer │
        ├──────────────────┤          ├───────────────────┤
        │ React Components  │          │ Server Functions  │
        │ State Management  │          │ Data Validation   │
        │ Charts & Tables   │          │ Business Logic    │
        └────────┬──────────┘          └─────────┬─────────┘
                 │                               │
        ┌────────▼───────────────────────────────▼────────┐
        │         Supabase (PostgreSQL)                  │
        ├────────────────────────────────────────────────┤
        │ • square_orders                                │
        │ • square_payments                              │
        │ • square_sales_summary                         │
        │ • jibble_employees                             │
        │ • jibble_attendance                            │
        │ • cashflow_data                                │
        │ • payroll_records                              │
        │ • booking_data                                 │
        └────┬─────────────────────────────────────┬────┘
             │                                     │
    ┌────────▼──────────┐             ┌───────────▼──────────┐
    │   Square POS      │             │  Jibble Attendance   │
    ├──────────────────┤             ├────────────────────┤
    │ • Orders         │             │ • Time Tracking    │
    │ • Payments       │             │ • Attendance       │
    │ • Discounts      │             │ • Employees        │
    │ • Items          │             │ • Teams            │
    └────────┬──────────┘             └────────┬───────────┘
             │                               │
    ┌────────▼────────────────────────────────▼───────┐
    │   External API Integration Layer                │
    ├──────────────────────────────────────────────┤
    │ • Scheduled Syncs (2 AM, 2:15 AM)           │
    │ • Webhook Listeners (optional)              │
    │ • Error Handling & Retries                  │
    └────────────────────────────────────────────┘
```

---

## User Journey Flows

### **Flow 1: Daily Operations (Manager)**

```
┌─ MORNING ─────────────────────────────┐
│ ┌─ User Logs In ─────────────────────┐│
│ │ Email + Password                   ││
│ └─────────────────────────────────────┘│
│            ↓                            │
│ ┌─ Dashboard Loads ──────────────────┐│
│ │ Yesterday's Sales Summary          ││
│ │ Today's Attendance                 ││
│ │ Alerts & Anomalies                 ││
│ └─────────────────────────────────────┘│
│            ↓                            │
│ ┌─ Manager Checks ───────────────────┐│
│ │ • Sales Reports (from Square)     ││
│ │ • Attendance (from Jibble)        ││
│ │ • Any Issues Noted                ││
│ └─────────────────────────────────────┘│
└────────────────────────────────────────┘

┌─ DURING DAY ──────────────────────────┐
│ ┌─ Ongoing Monitoring ───────────────┐│
│ │ Monitor Sales Dashboard            ││
│ │ Watch for anomalies                ││
│ │ Address issues real-time           ││
│ └─────────────────────────────────────┘│
│            ↓                            │
│ ┌─ Record Manual Entries ────────────┐│
│ │ Expenses that won't auto-sync      ││
│ │ Supplier payments                  ││
│ │ Special items                      ││
│ └─────────────────────────────────────┘│
└────────────────────────────────────────┘

┌─ END OF DAY ──────────────────────────┐
│ ┌─ Data Entry ───────────────────────┐│
│ │ Fill in manual expenses            ││
│ │ Verify Square sync completed       ││
│ │ Check Jibble sync completed        ││
│ └─────────────────────────────────────┘│
│            ↓                            │
│ ┌─ Reconciliation ───────────────────┐│
│ │ Match manual + auto data           ││
│ │ Note any discrepancies             ││
│ │ Save all entries                   ││
│ └─────────────────────────────────────┘│
│            ↓                            │
│ ┌─ Review & Sign Off ────────────────┐│
│ │ Sign off on day's operations       ││
│ │ Archive any notes                  ││
│ └─────────────────────────────────────┘│
└────────────────────────────────────────┘
```

---

### **Flow 2: Sales Data Integration**

```
Square POS
    ↓
┌─ Order Created ─────────────────┐
│ • Customer info                 │
│ • Line items                    │
│ • Payment method                │
│ • Timestamp                     │
└────────────────┬────────────────┘
                 │
        (Daily at 2:00 AM)
                 ↓
┌─ Sync Triggered ────────────────┐
│ GET /api/integrations/sync-    │
│     square                      │
└────────────────┬────────────────┘
                 │
        (Fetch last 7 days)
                 ↓
┌─ Square API Response ───────────┐
│ JSON array of completed orders  │
└────────────────┬────────────────┘
                 │
        (Transform & validate)
                 ↓
┌─ Database Insert ───────────────┐
│ • square_orders table           │
│ • square_order_items table      │
│ • square_payments table         │
└────────────────┬────────────────┘
                 │
        (Aggregate data)
                 ↓
┌─ Generate Summary ──────────────┐
│ • Total sales                   │
│ • Payment breakdown             │
│ • Top items                     │
│ • Metrics                       │
└────────────────┬────────────────┘
                 │
        (Store in summary table)
                 ↓
┌─ Database Update ───────────────┐
│ • square_sales_summary          │
│ • square_sync_metadata          │
│ • Status: SUCCESS               │
└────────────────┬────────────────┘
                 │
        (Real-time display)
                 ↓
┌─ Frontend Updates ──────────────┐
│ Sales Reports Dashboard         │
│ Analytics Page                  │
│ Executive Overview              │
└─────────────────────────────────┘
```

---

### **Flow 3: Attendance Data Integration**

```
Jibble Time Tracking
    ↓
┌─ Employee Check-in/out ─────────┐
│ • Clock-in time                 │
│ • Clock-out time                │
│ • Break duration                │
│ • Location                      │
└────────────────┬────────────────┘
                 │
        (Daily at 2:15 AM)
                 ↓
┌─ Sync Triggered ────────────────┐
│ GET /api/integrations/sync-    │
│     jibble                      │
└────────────────┬────────────────┘
                 │
    (Fetch employees + attendance)
                 ↓
┌─ Jibble API Response ───────────┐
│ • Employee list                 │
│ • Time entries                  │
│ • Team data                     │
└────────────────┬────────────────┘
                 │
   (Transform & validate data)
                 ↓
┌─ Database Insert ───────────────┐
│ • jibble_employees table        │
│ • jibble_time_entries table     │
│ • jibble_teams table            │
└────────────────┬────────────────┘
                 │
   (Parse & aggregate attendance)
                 ↓
┌─ Generate Summary ──────────────┐
│ • Present count                 │
│ • Absent count                  │
│ • Total hours                   │
│ • Attendance rate               │
└────────────────┬────────────────┘
                 │
        (Store daily summary)
                 ↓
┌─ Database Update ───────────────┐
│ • jibble_attendance_summary     │
│ • jibble_sync_metadata          │
│ • Status: SUCCESS               │
└────────────────┬────────────────┘
                 │
        (Real-time display)
                 ↓
┌─ Frontend Updates ──────────────┐
│ Payroll Attendance Tab          │
│ Employee Daily Records          │
│ Analytics Dashboard             │
└─────────────────────────────────┘
```

---

### **Flow 4: Manual Data Entry**

```
User Opens App
    ↓
┌─ Navigate to Data Entry ────────┐
│ Click: Data Entry Menu          │
└────────────────┬────────────────┘
                 │
┌─ Select Entity ─────────────────┐
│ • Restaurant                    │
│ • Homestay                      │
│ • Cafe                          │
│ • Others                        │
└────────────────┬────────────────┘
                 │
┌─ Select Month ──────────────────┐
│ Dropdown: Jan, Feb, Mar...      │
└────────────────┬────────────────┘
                 │
┌─ Fill in Form ──────────────────┐
│ • Sales (Cash/Card/UPI)         │
│ • Purchases                     │
│ • Salaries                      │
│ • Utilities                     │
│ • Other expenses                │
└────────────────┬────────────────┘
                 │
        (Frontend validation)
                 ↓
┌─ Client-side Checks ────────────┐
│ • Required fields filled        │
│ • Numeric validation            │
│ • Reasonable ranges             │
└────────────────┬────────────────┘
                 │
         (Send to server)
                 ↓
┌─ Server Validation ─────────────┐
│ • User permission check         │
│ • Data type validation          │
│ • Business logic checks         │
│ • Duplicate check               │
└────────────────┬────────────────┘
                 │
              ✅ / ❌
                 │
         ┌───────┴───────┐
         │               │
      Success         Error
         │               │
         ↓               ↓
    ┌──────────┐    ┌──────────┐
    │ INSERT   │    │ Return   │
    │ INTO     │    │ Error    │
    │ Database │    │ Message  │
    └────┬─────┘    └──────────┘
         │
    ┌────▼──────────┐
    │ Generate ID   │
    │ Set timestamp │
    │ Calculate KPIs│
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │ Commit to DB  │
    └────┬──────────┘
         │
    ┌────▼──────────────┐
    │ Return Success    │
    │ Display Confirmation
    │ Update Dashboard  │
    └───────────────────┘
```

---

## System Integration Flows

### **Real-Time Data Flow**

```
┌──────────────────────────────────────────────────────────┐
│  Silvertip App - Real-Time Data Architecture            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  User Action          Frontend          Backend          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  1. Open Dashboard                                      │
│          ↓                                              │
│     Query Cache Check                                  │
│          ↓                                              │
│     (If fresh, display)    (If stale, fetch from API) │
│          ↓                          ↓                  │
│     Local State Update      GET /api/summary           │
│          ↓                          ↓                  │
│     Display KPIs        Supabase Query                │
│                               ↓                        │
│                        Process Results                │
│                               ↓                        │
│                        Return JSON                     │
│                               ↓                        │
│                        Update Frontend                │
│                               ↓                        │
│                        Render Charts                  │
│                               ↓                        │
│                        User sees data                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Module Interaction Map

### **How Modules Connect**

```
┌─────────────────────────────────────────────────────────┐
│                    Sales Reports                         │
│        (Feeds Analytics & Executive Overview)            │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ↓             ↓             ↓
    ┌────────┐   ┌─────────┐  ┌───────────┐
    │Analytics  │ Dashboard   Menu Costing
    └────┬────┘   └────┬────┘  └────┬─────┘
         │             │            │
         └─────────────┼────────────┘
                       ↓
          ┌─────────────────────┐
          │  Executive Overview  │
          │  (360° Dashboard)    │
          └──────────┬──────────┘
                     │
      ┌──────────────┼──────────────┐
      ↓              ↓              ↓
┌──────────┐  ┌──────────┐  ┌──────────┐
│Payroll   │  │Stays     │  │Cash/      │
│Module    │  │Module    │  │Expense    │
└──────────┘  └──────────┘  └──────────┘
      │              │              │
      └──────────────┼──────────────┘
                     ↓
        ┌────────────────────┐
        │  Data Integrations │
        │  • Square → Sales  │
        │  • Jibble → HR     │
        │  • Manual → All    │
        └────────────────────┘
```

---

## Decision Trees

### **Data Refresh Decision Tree**

```
User opens app
    ↓
Is data displayed?
    ├─ YES → Is it fresh? (< 1 hour old)
    │         ├─ YES → Use cached data
    │         │        ↓
    │         │        User sees data
    │         │
    │         └─ NO → Fetch from server
    │                 ↓
    │                 Update cache
    │                 ↓
    │                 Display updated data
    │
    └─ NO → Fetch from server
             ↓
             (Show loading spinner)
             ↓
             Process response
             ↓
             Cache result
             ↓
             Display data
```

### **Error Handling Decision Tree**

```
API Call Triggered
    ↓
Request sent to server
    ↓
Response received
    ├─ Status 200 (Success)
    │   ├─ Parse response
    │   ├─ Validate data
    │   └─ Display results
    │
    ├─ Status 400-499 (Client Error)
    │   ├─ Invalid request
    │   ├─ Missing fields
    │   └─ Show specific error message
    │
    ├─ Status 500-599 (Server Error)
    │   ├─ Database issue
    │   ├─ Integration issue
    │   └─ Show "Try again later"
    │
    └─ Network Error
        ├─ No internet
        └─ Show offline message
```

---

## Module Dependencies

### **Required Data for Each Module**

| Module | Requires | Depends On |
|--------|----------|-----------|
| **Dashboard** | All tables | All modules |
| **Sales Reports** | square_* | Square API |
| **Menu Costing** | Sales data | Data Entry |
| **Payroll** | jibble_* | Jibble API, Employees |
| **Stays** | booking_* | Manual entry |
| **Analytics** | All metrics | All modules |
| **Admin** | All data | All tables |

---

## Data Validation Pipeline

```
User Input
    ↓
┌─ Frontend Validation ──────────────┐
│ • Required fields                  │
│ • Data type (string/number/date)  │
│ • Length checks                    │
│ • Pattern matching (email, phone)  │
└────────────────┬───────────────────┘
                 │
            ✅ / ❌
                 │
          ┌──────┴──────┐
       Invalid        Valid
          │              │
          ↓              ↓
    Error toast    Send to Server
                         │
              ┌──────────▼──────────┐
              │ Server Validation   │
              │ • Permissions check │
              │ • Type check        │
              │ • Range check       │
              │ • Duplicate check   │
              └──────────┬──────────┘
                         │
                    ✅ / ❌
                         │
                  ┌──────┴──────┐
               Invalid        Valid
                  │              │
                  ↓              ↓
              Error JSON   Database Insert
                  │              │
              Return to      Commit
              Client          │
                  │            ↓
                  │        Success Response
                  │            │
                  └────┬───────┘
                       │
                       ↓
                 Update Frontend
```

---

## Process Maturity Levels

### **Current State (Phase 1)**

- ✅ Manual data entry
- ✅ Basic dashboards
- ✅ Square integration (read-only)
- ✅ Jibble integration (read-only)
- ⏳ Limited automation

### **Next Phase (Phase 2)**

- 🔄 Webhook-based real-time sync (Square)
- 🔄 Predictive analytics
- 🔄 Automated alerts
- 🔄 Advanced reporting

### **Future Phase (Phase 3)**

- 🎯 ML-based insights
- 🎯 Automated decisions
- 🎯 Mobile app
- 🎯 Multi-location management

---

**End of Process Flows Document**
