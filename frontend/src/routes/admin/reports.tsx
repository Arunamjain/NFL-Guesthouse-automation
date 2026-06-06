import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/common/Button";
import { DataTable, type Column } from "@/components/common/DataTable";
import { SelectField } from "@/components/forms/SelectField";
import { FormInput } from "@/components/forms/FormInput";

export const Route = createFileRoute("/admin/reports")({ component: ReportsPage });

const COLORS = ["#1e40af", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const monthly = [
  { month: "Jan", bookings: 12, revenue: 42000 }, { month: "Feb", bookings: 18, revenue: 63000 },
  { month: "Mar", bookings: 22, revenue: 71000 }, { month: "Apr", bookings: 16, revenue: 52000 },
  { month: "May", bookings: 25, revenue: 88000 }, { month: "Jun", bookings: 30, revenue: 105000 },
];
const occupancy = [{ name: "Vasundra", value: 78 }, { name: "Dangoti", value: 62 }];
const catSplit = [{ name: "Executive", value: 42 }, { name: "Non-Executive", value: 58 }];
const approvalSplit = [{ name: "Approved", value: 70 }, { name: "Rejected", value: 30 }];
const feedbackTrend = [
  { month: "Jan", r: 4.2 }, { month: "Feb", r: 4.0 }, { month: "Mar", r: 4.3 },
  { month: "Apr", r: 4.1 }, { month: "May", r: 4.4 }, { month: "Jun", r: 4.5 },
];

interface Row { id: string; month: string; total: number; approved: number; rejected: number; revenue: string; occ: string; fb: string }
const summary: Row[] = monthly.map((m, i) => ({
  id: m.month, month: m.month, total: m.bookings, approved: Math.round(m.bookings * 0.8), rejected: Math.round(m.bookings * 0.2),
  revenue: `₹${m.revenue.toLocaleString()}`, occ: `${60 + i * 3}%`, fb: feedbackTrend[i].r.toFixed(1),
}));

function ReportsPage() {
  const cols: Column<Row>[] = [
    { key: "m", header: "Month", render: (r) => r.month },
    { key: "t", header: "Total Bookings", render: (r) => r.total },
    { key: "a", header: "Approved", render: (r) => r.approved },
    { key: "r", header: "Rejected", render: (r) => r.rejected },
    { key: "rv", header: "Revenue", render: (r) => r.revenue },
    { key: "o", header: "Occupancy", render: (r) => r.occ },
    { key: "f", header: "Avg Feedback", render: (r) => r.fb },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <PageHeader title="Reports & Analytics" subtitle="Insights across bookings, payments and feedback." actions={
        <>
          <Button variant="secondary" leftIcon={<FileText className="size-4" />} onClick={() => toast.success("Report export will be connected to backend.")}>Export PDF</Button>
          <Button variant="secondary" leftIcon={<Download className="size-4" />} onClick={() => toast.success("Report export will be connected to backend.")}>Export CSV</Button>
        </>
      } />
      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        <FormInput type="date" label="From" />
        <FormInput type="date" label="To" />
        <SelectField label="Guest House"><option>All</option><option>Vasundra</option><option>Dangoti</option></SelectField>
        <SelectField label="Category"><option>All</option><option>Executive</option><option>Non-Executive</option></SelectField>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Monthly Bookings"><ResponsiveContainer>
          <LineChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Line dataKey="bookings" stroke="#1e40af" strokeWidth={2} /></LineChart>
        </ResponsiveContainer></ChartCard>
        <ChartCard title="Payment Collection"><ResponsiveContainer>
          <AreaChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b98133" /></AreaChart>
        </ResponsiveContainer></ChartCard>
        <ChartCard title="Guest House Occupancy"><ResponsiveContainer>
          <BarChart data={occupancy}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="value" fill="#1e40af" radius={[6, 6, 0, 0]} /></BarChart>
        </ResponsiveContainer></ChartCard>
        <ChartCard title="Executive vs Non-Executive"><ResponsiveContainer>
          <PieChart><Pie data={catSplit} dataKey="value" nameKey="name" outerRadius={90} label>{catSplit.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart>
        </ResponsiveContainer></ChartCard>
        <ChartCard title="Approval vs Rejection"><ResponsiveContainer>
          <PieChart><Pie data={approvalSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} label>{approvalSplit.map((_, i) => <Cell key={i} fill={COLORS[i + 2]} />)}</Pie><Tooltip /><Legend /></PieChart>
        </ResponsiveContainer></ChartCard>
        <ChartCard title="Feedback Trend"><ResponsiveContainer>
          <LineChart data={feedbackTrend}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" fontSize={12} /><YAxis domain={[0, 5]} fontSize={12} /><Tooltip /><Line dataKey="r" stroke="#f59e0b" strokeWidth={2} /></LineChart>
        </ResponsiveContainer></ChartCard>
      </div>

      <h3 className="font-semibold mb-3">Summary</h3>
      <DataTable columns={cols} rows={summary} />
    </DashboardLayout>
  );
}
