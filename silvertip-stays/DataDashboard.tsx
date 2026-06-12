'use client';

import { useEffect, useState } from 'react';
import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface LineItem {
  uid: string;
  name: string;
  quantity: string;
  basePriceMoney: { amount: number; currency: string };
  grossSalesMoney: { amount: number; currency: string };
}

interface Order {
  id: string;
  createdAt: string;
  totalMoney: { amount: number; currency: string };
  totalTaxMoney?: { amount: number; currency: string };
  totalDiscountMoney?: { amount: number; currency: string };
  locationId?: string;
  state?: string;
  lineItems: LineItem[];
}

interface AttendanceEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  clockInTime: string;
  clockOutTime: string;
  duration: number;
  date: string;
  status: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
}

interface ExtractionData {
  timestamp: string;
  mode: string;
  note?: string;
  square: {
    ordersExtracted: number;
    totalRevenue: number;
    averageOrderValue: number;
    orders: Order[];
  };
  jibble: {
    timeEntriesExtracted: number;
    employeesExtracted: number;
    totalHours: number;
    attendance: AttendanceEntry[];
    employees: Employee[];
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatters & Utilities
// ─────────────────────────────────────────────────────────────────────────────

function fmtCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function fmtNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(num));
}

function fmtTime(iso: string): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
  catch { return iso; }
}

function fmtDateTime(iso: string): string {
  try { return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  catch { return iso; }
}

function exportToCSV(rows: Record<string, unknown>[], filename: string): void {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens — 2-colour system (warm + sage)
// warm = burnt orange → sales / revenue
// sage = dark green   → labor / operations
// ─────────────────────────────────────────────────────────────────────────────

type Context = 'sales' | 'labor' | 'neutral';

const CTX: Record<Context, { cardBg: string; bar: string; label: string; value: string; badge: string }> = {
  sales: {
    cardBg: 'bg-[#fef3f2]',
    bar:    'bg-[#c1410a]',
    label:  'text-[#7e2d0e]',
    value:  'text-[#c1410a]',
    badge:  'bg-[#fde8e6] text-[#7e2d0e]',
  },
  labor: {
    cardBg: 'bg-[#f5f9f6]',
    bar:    'bg-[#2d5016]',
    label:  'text-[#1a3a0a]',
    value:  'text-[#2d5016]',
    badge:  'bg-[#e8f1eb] text-[#1a3a0a]',
  },
  neutral: {
    cardBg: 'bg-slate-50',
    bar:    'bg-slate-400',
    label:  'text-slate-600',
    value:  'text-slate-700',
    badge:  'bg-slate-100 text-slate-600',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SkeletonLoader
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="pb-6 border-b border-slate-200 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-300 rounded-xl" />
              <div className="h-8 bg-slate-300 rounded w-56" />
            </div>
            <div className="h-4 bg-slate-200 rounded w-64" />
          </div>
          <div className="h-12 bg-slate-200 rounded w-40 hidden sm:block" />
        </div>
        {/* Tab skeleton */}
        <div className="flex gap-2">
          {[160, 180, 130, 120].map((w, i) => (
            <div key={i} className="h-11 bg-slate-200 rounded-lg" style={{ width: w }} />
          ))}
        </div>
        {/* KPI skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-24" />
              <div className="h-8 bg-slate-300 rounded w-28" />
              <div className="h-3 bg-slate-100 rounded w-16" />
            </div>
          ))}
        </div>
        {/* Table skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="h-5 bg-slate-200 rounded w-48" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ErrorState
// ─────────────────────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md w-full shadow-sm">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Failed to load data</h2>
        <p className="text-red-700 text-sm mb-4">{message}</p>
        <p className="text-xs text-slate-500">
          Ensure <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">extraction_2026-05-14_mock.json</code> is
          served from <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">/data/extractions/</code>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 w-full py-2.5 rounded-lg bg-[#c1410a] text-white text-sm font-medium hover:bg-[#a13608] transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KPICard
// ─────────────────────────────────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  context: Context;
}

function KPICard({ label, value, sub, icon, context }: KPICardProps) {
  const c = CTX[context];
  return (
    <div className={`${c.cardBg} rounded-xl border border-slate-200 p-4 sm:p-5 relative overflow-hidden`}>
      {/* Colour bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.bar}`} />
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs sm:text-sm font-medium uppercase tracking-wide ${c.label} leading-tight`}>{label}</p>
        <span className="text-xl" aria-label={label}>{icon}</span>
      </div>
      <p className={`text-2xl sm:text-3xl font-bold tabular-nums ${c.value}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TableHeader (shared section header with optional export button)
// ─────────────────────────────────────────────────────────────────────────────

function TableHeader({
  title, icon, onExport,
}: { title: string; icon: string; onExport?: () => void }) {
  return (
    <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
      <h2 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {onExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#c1410a] text-white hover:bg-[#a13608] transition-colors shrink-0"
          aria-label={`Export ${title} as CSV`}
        >
          📥 Export CSV
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SalesTab
// ─────────────────────────────────────────────────────────────────────────────

function SalesTab({ data }: { data: ExtractionData }) {
  // Compute top items
  const itemMap = data.square.orders.reduce(
    (acc, order) => {
      order.lineItems.forEach((item) => {
        if (!acc[item.name]) acc[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        acc[item.name].quantity += parseInt(item.quantity || '0');
        acc[item.name].revenue  += item.basePriceMoney.amount;
      });
      return acc;
    },
    {} as Record<string, { name: string; quantity: number; revenue: number }>
  );

  const topItems = Object.values(itemMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const recentOrders = [...data.square.orders].slice(0, 10);
  const totalItemRevenue = topItems.reduce((s, i) => s + i.revenue, 0);

  const exportTopItems = () =>
    exportToCSV(
      topItems.map((i) => ({
        Item: i.name,
        'Quantity Sold': i.quantity,
        'Revenue (₹)': (i.revenue / 100).toFixed(2),
        '% of Total': (((i.revenue / 100) / data.square.totalRevenue) * 100).toFixed(1) + '%',
      })),
      'silvertip_top_items.csv'
    );

  const exportOrders = () =>
    exportToCSV(
      recentOrders.map((o) => ({
        'Order ID': o.id,
        'Date & Time': new Date(o.createdAt).toLocaleString('en-IN'),
        'Amount (₹)': (o.totalMoney.amount / 100).toFixed(2),
        'Tax (₹)': o.totalTaxMoney ? (o.totalTaxMoney.amount / 100).toFixed(2) : '0',
      })),
      'silvertip_recent_orders.csv'
    );

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          label="Total Orders"
          value={fmtNumber(data.square.ordersExtracted)}
          sub="90-day period"
          icon="📦"
          context="sales"
        />
        <KPICard
          label="Total Revenue"
          value={fmtCurrency(data.square.totalRevenue)}
          sub="incl. taxes"
          icon="💰"
          context="sales"
        />
        <KPICard
          label="Avg Order Value"
          value={fmtCurrency(data.square.averageOrderValue)}
          sub="per transaction"
          icon="🧾"
          context="sales"
        />
        <KPICard
          label="Data Period"
          value="90 Days"
          sub={new Date(data.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          icon="📅"
          context="neutral"
        />
      </div>

      {/* Top Items */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <TableHeader title="Top 5 Items by Revenue" icon="🏆" onExport={exportTopItems} />

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-10">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty Sold</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topItems.map((item, idx) => {
                const revINR = item.revenue / 100;
                const pct = ((revINR / data.square.totalRevenue) * 100).toFixed(1);
                const isTop = idx === 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-400 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {item.name}
                      {isTop && (
                        <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fde8e6] text-[#7e2d0e]">
                          Top Seller
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.quantity > 100 ? 'bg-[#e8f1eb] text-[#1a3a0a]' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {fmtNumber(item.quantity)} sold
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">{fmtCurrency(revINR)}</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-500">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={3} className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Top 5 Total</td>
                <td className="px-6 py-3 text-sm text-right font-bold text-slate-900">{fmtCurrency(totalItemRevenue / 100)}</td>
                <td className="px-6 py-3 text-sm text-right text-slate-500">
                  {(((totalItemRevenue / 100) / data.square.totalRevenue) * 100).toFixed(1)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {topItems.map((item, idx) => {
            const revINR = item.revenue / 100;
            const pct = ((revINR / data.square.totalRevenue) * 100).toFixed(1);
            return (
              <div key={idx} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-slate-400 font-bold w-4 shrink-0">{idx + 1}</span>
                    <span className="text-sm font-semibold text-slate-900 truncate">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#c1410a] tabular-nums shrink-0">{fmtCurrency(revINR)}</span>
                </div>
                <div className="flex items-center justify-between pl-6 text-xs text-slate-500">
                  <span>{fmtNumber(item.quantity)} sold</span>
                  <span>{pct}% of revenue</span>
                </div>
                {/* Revenue share bar */}
                <div className="pl-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c1410a] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <TableHeader title="Recent Orders (Latest 10)" icon="🕐" onExport={exportOrders} />

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order, idx) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-700 text-xs">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{fmtDateTime(order.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">{fmtCurrency(order.totalMoney.amount / 100)}</td>
                  <td className="px-6 py-4 text-sm text-right text-slate-500">
                    {order.totalTaxMoney ? fmtCurrency(order.totalTaxMoney.amount / 100) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-slate-100">
          {recentOrders.map((order, idx) => (
            <div key={order.id} className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{order.id}</span>
                <span className="text-sm font-bold text-slate-900">{fmtCurrency(order.totalMoney.amount / 100)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{fmtDateTime(order.createdAt)}</span>
                {order.totalTaxMoney && <span>Tax: {fmtCurrency(order.totalTaxMoney.amount / 100)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LaborTab
// ─────────────────────────────────────────────────────────────────────────────

function LaborTab({ data }: { data: ExtractionData }) {
  const avgHours = data.jibble.totalHours / data.jibble.employeesExtracted;
  const attendanceRate = Math.round(
    (data.jibble.timeEntriesExtracted / (data.jibble.employeesExtracted * 90)) * 100
  );
  const recentAttendance = [...data.jibble.attendance].slice(0, 10);

  // Entries per employee
  const empWithEntries = data.jibble.employees.map((emp) => ({
    ...emp,
    entries: data.jibble.attendance.filter((a) => a.employeeId === emp.id).length,
  })).sort((a, b) => b.entries - a.entries);

  const maxEntries = Math.max(...empWithEntries.map((e) => e.entries), 1);

  const exportEmployees = () =>
    exportToCSV(
      empWithEntries.map((e) => ({ Name: e.name, Department: e.department, 'Entries Logged': e.entries })),
      'silvertip_employees.csv'
    );

  const exportAttendance = () =>
    exportToCSV(
      recentAttendance.map((a) => ({
        Employee: a.employeeName,
        Date: a.date,
        'Clock In': a.clockInTime,
        'Clock Out': a.clockOutTime,
        'Hours': (a.duration / 60).toFixed(1),
        Status: a.status,
      })),
      'silvertip_attendance.csv'
    );

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          label="Total Hours Worked"
          value={fmtNumber(data.jibble.totalHours)}
          sub="90-day period"
          icon="⏱️"
          context="labor"
        />
        <KPICard
          label="Active Employees"
          value={String(data.jibble.employeesExtracted)}
          sub="with time entries"
          icon="👥"
          context="labor"
        />
        <KPICard
          label="Avg Hours / Person"
          value={avgHours.toFixed(1) + 'h'}
          sub="over 90 days"
          icon="📊"
          context="labor"
        />
        <KPICard
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          sub="vs 90-day target"
          icon="✅"
          context={attendanceRate >= 80 ? 'labor' : 'neutral'}
        />
      </div>

      {/* Employee Directory */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <TableHeader title="Employee Directory" icon="👤" onExport={exportEmployees} />

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Entries</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {empWithEntries.map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">{emp.entries}</td>
                  <td className="px-6 py-4">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-full">
                      <div
                        className="h-full bg-[#2d5016] rounded-full"
                        style={{ width: `${(emp.entries / maxEntries) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-slate-100">
          {empWithEntries.map((emp, idx) => (
            <div key={emp.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-slate-400 font-bold w-4 shrink-0">{idx + 1}</span>
                  <span className="text-sm font-semibold text-slate-900 truncate">{emp.name}</span>
                </div>
                <span className="text-sm font-bold text-[#2d5016] tabular-nums">{emp.entries}</span>
              </div>
              <div className="pl-6 flex items-center gap-3">
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{emp.department}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2d5016] rounded-full" style={{ width: `${(emp.entries / maxEntries) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Log */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <TableHeader title="Recent Attendance (Latest 10)" icon="🕐" onExport={exportAttendance} />

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Clock Out</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAttendance.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{entry.employeeName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{entry.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{fmtTime(entry.clockInTime)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{fmtTime(entry.clockOutTime)}</td>
                  <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">
                    {(entry.duration / 60).toFixed(1)}h
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      entry.status === 'COMPLETED'
                        ? 'bg-[#e8f1eb] text-[#1a3a0a]'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-slate-100">
          {recentAttendance.map((entry, idx) => (
            <div key={entry.id} className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{entry.employeeName}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  entry.status === 'COMPLETED' ? 'bg-[#e8f1eb] text-[#1a3a0a]' : 'bg-amber-100 text-amber-700'
                }`}>
                  {entry.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{entry.date}</span>
                <span>·</span>
                <span>{fmtTime(entry.clockInTime)} → {fmtTime(entry.clockOutTime)}</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">{(entry.duration / 60).toFixed(1)}h</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BookingsTab (placeholder)
// ─────────────────────────────────────────────────────────────────────────────

function BookingsTab() {
  return (
    <div className="space-y-5">
      {/* Placeholder KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Bookings', icon: '🏨' },
          { label: 'Occupancy Rate', icon: '📈' },
          { label: 'Bookings Revenue', icon: '💰' },
          { label: 'Avg Stay Length', icon: '🌙' },
        ].map(({ label, icon }) => (
          <div key={label} className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
              <span className="text-xl opacity-30">{icon}</span>
            </div>
            <div className="h-8 bg-slate-200 rounded w-24 mb-1" />
            <div className="h-3 bg-slate-100 rounded w-16" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🏨</span>
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-2">Bookings Coming Soon</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Airbnb and direct booking analytics will appear here once the integration is active.
          Connect your Silvertip Stays data to unlock occupancy heatmaps, revenue tracking, and guest insights.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 justify-center text-xs text-slate-400">
          {['Upcoming Reservations', 'Occupancy Heatmap', 'Revenue by Property', 'Guest Analytics'].map((f) => (
            <span key={f} className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RawDataTab
// ─────────────────────────────────────────────────────────────────────────────

function RawDataTab({ data }: { data: ExtractionData }) {
  const [copied, setCopied] = useState(false);
  const jsonStr = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `silvertip_extraction_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Mode',     value: data.mode },
          { label: 'Orders',   value: fmtNumber(data.square.ordersExtracted) },
          { label: 'Employees', value: String(data.jibble.employeesExtracted) },
          { label: 'Captured', value: new Date(data.timestamp).toLocaleDateString('en-IN') },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>📋</span> Raw JSON Extraction
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Copy JSON to clipboard"
            >
              {copied ? '✅ Copied' : '📋 Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#c1410a] text-white hover:bg-[#a13608] transition-colors"
              aria-label="Download JSON file"
            >
              📥 Download
            </button>
          </div>
        </div>
        <pre className="bg-slate-950 p-4 sm:p-6 overflow-auto max-h-[60vh] text-[11px] sm:text-xs text-emerald-400 leading-relaxed font-mono">
          {jsonStr}
        </pre>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

type TabId = 'sales' | 'labor' | 'bookings' | 'raw';

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'sales',    label: 'Sales Overview',     icon: '📊' },
  { id: 'labor',    label: 'Labor & Attendance',  icon: '👥' },
  { id: 'bookings', label: 'Bookings',            icon: '🏨' },
  { id: 'raw',      label: 'Raw Data',            icon: '📋' },
];

export function DataDashboard() {
  const [data,       setData]      = useState<ExtractionData | null>(null);
  const [loading,    setLoading]   = useState(true);
  const [error,      setError]     = useState<string | null>(null);
  const [activeTab,  setActiveTab] = useState<TabId>('sales');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/data/extractions/extraction_2026-05-14_mock.json');
        if (!res.ok) throw new Error(`HTTP ${res.status} — Failed to load extraction data`);
        setData(await res.json() as ExtractionData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error loading data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <SkeletonLoader />;
  if (error)   return <ErrorState message={error} />;
  if (!data)   return <ErrorState message="No data returned from server." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              {/* Brand mark */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ background: 'linear-gradient(135deg, #c1410a 0%, #7e2d0e 100%)' }}
                aria-label="Silvertip"
              >
                S
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Silvertip Analytics
              </h1>
            </div>
            <p className="text-sm text-slate-500 ml-[52px]">360° hospitality intelligence hub</p>
          </div>

          <div className="ml-[52px] sm:ml-0 sm:text-right">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Last Updated</p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              {new Date(data.timestamp).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            <span className={`inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
              data.mode === 'mock'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-[#e8f1eb] text-[#1a3a0a]'
            }`}>
              {data.mode === 'mock' ? '⚠ Mock Data' : '✅ Live Data'}
            </span>
          </div>
        </div>

        {/* ── Tab Navigation ──────────────────────────────────────────────── */}
        {/* Desktop tabs */}
        <div className="hidden sm:flex gap-1 mb-8 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex items-center gap-2 px-5 py-3 rounded-t-lg text-sm font-medium transition-all duration-150 border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'bg-white text-slate-900 border-[#c1410a] shadow-sm'
                  : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-white/70',
              ].join(' ')}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile bottom-style tab bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors',
                activeTab === tab.id ? 'text-[#c1410a]' : 'text-slate-400',
              ].join(' ')}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="leading-none">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* ── Tab Content ─────────────────────────────────────────────────── */}
        {/* Extra bottom padding on mobile for fixed nav */}
        <div className="pb-24 sm:pb-0">
          {activeTab === 'sales'    && <SalesTab    data={data} />}
          {activeTab === 'labor'    && <LaborTab    data={data} />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'raw'      && <RawDataTab  data={data} />}
        </div>
      </div>
    </div>
  );
}

export default DataDashboard;
