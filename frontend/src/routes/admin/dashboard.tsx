import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { BedDouble, CalendarCheck, CheckCircle2, CreditCard, MessageSquare, TrendingUp, Users, XCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useApp } from "@/lib/app-store";
import type { Booking } from "@/types";
import { formatDate } from "@/utils/formatters";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

const COLORS = ["#1e40af", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

function AdminDashboard() {
  const { bookings, feedback } = useApp();

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.hrStatus === "Pending Approval").length,
    approved: bookings.filter((b) => b.hrStatus === "Approved").length,
    rejected: bookings.filter((b) => b.hrStatus === "Rejected").length,
    payPending: bookings.filter((b) => b.paymentStatus === "Payment Verification Pending").length,
    payVerified: bookings.filter((b) => b.paymentStatus === "Payment Verified").length,
    occupancy: 72,
    avgFb: (feedback.reduce((s, f) => s + f.overall, 0) / Math.max(feedback.length, 1)).toFixed(1),
  }), [bookings, feedback]);

  const monthly = [
    { month: "Jan", bookings: 12 }, { month: "Feb", bookings: 18 }, { month: "Mar", bookings: 22 },
    { month: "Apr", bookings: 16 }, { month: "May", bookings: 25 }, { month: "Jun", bookings: 30 },
  ];
  const occupancy = [{ name: "Vasundra", value: 78 }, { name: "Dangoti", value: 62 }];
  const categorySplit = [
    { name: "Executive", value: bookings.filter((b) => b.category === "Executive Employee").length },
    { name: "Non-Executive", value: bookings.filter((b) => b.category === "Non-Executive Employee").length },
  ];
  const paymentSplit = [
    { name: "Verified", value: stats.payVerified },
    { name: "Pending", value: stats.payPending },
    { name: "Not Started", value: bookings.filter((b) => b.paymentStatus === "Not Started").length },
  ];

  const cols: Column<Booking>[] = [
    { key: "id", header: "Booking ID", render: (b) => <span className="font-mono text-xs">{b.id}</span> },
    { key: "emp", header: "Employee", render: (b) => b.employeeName },
    { key: "cat", header: "Category", render: (b) => <span className="text-xs">{b.category}</span> },
    { key: "gh", header: "Guest House", render: (b) => b.guestHouseName },
    { key: "date", header: "Check-in", render: (b) => formatDate(b.checkIn) },
    { key: "stat", header: "Status", render: (b) => <StatusBadge status={b.bookingStatus} /> },
    { key: "act", header: "", render: () => <Link to="/admin/approvals"><Button size="sm" variant="secondary">Review</Button></Link> },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <PageHeader title="Admin / HR Dashboard" subtitle="Overview of guest house operations, approvals, payments and feedback." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Bookings" value={stats.total} icon={CalendarCheck} tone="primary" />
        <StatCard label="Pending Approvals" value={stats.pending} icon={MessageSquare} tone="warning" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} tone="success" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} tone="danger" />
        <StatCard label="Payment Pending" value={stats.payPending} icon={CreditCard} tone="warning" />
        <StatCard label="Payment Verified" value={stats.payVerified} icon={CheckCircle2} tone="success" />
        <StatCard label="Occupancy Rate" value={`${stats.occupancy}%`} icon={BedDouble} tone="info" />
        <StatCard label="Avg Feedback" value={`${stats.avgFb} / 5`} icon={TrendingUp} tone="primary" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Monthly Booking Trend" subtitle="Bookings over the last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#1e40af" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Guest House Occupancy" subtitle="Current occupancy %">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occupancy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Employee Category Split">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categorySplit} dataKey="value" nameKey="name" outerRadius={90} label>
                {categorySplit.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Payment Status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={paymentSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>
                {paymentSplit.map((_, i) => <Cell key={i} fill={COLORS[i + 1]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-3">Recent Requests</h3>
          <DataTable columns={cols} rows={bookings.slice(0, 6)} />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid gap-2">
            <Link to="/admin/approvals"><Button fullWidth leftIcon={<MessageSquare className="size-4" />}>Review Approvals</Button></Link>
            <Link to="/admin/rooms"><Button fullWidth variant="secondary" leftIcon={<BedDouble className="size-4" />}>Manage Rooms</Button></Link>
            <Link to="/admin/payments"><Button fullWidth variant="secondary" leftIcon={<CreditCard className="size-4" />}>Verify Payments</Button></Link>
            <Link to="/admin/reports"><Button fullWidth variant="secondary" leftIcon={<Users className="size-4" />}>View Reports</Button></Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
