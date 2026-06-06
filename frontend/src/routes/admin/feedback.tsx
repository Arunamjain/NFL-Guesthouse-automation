import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Star, ThumbsDown, ThumbsUp, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";
import type { Feedback } from "@/types";
import { formatDate } from "@/utils/formatters";

export const Route = createFileRoute("/admin/feedback")({ component: AdminFeedbackPage });

function AdminFeedbackPage() {
  const { feedback } = useApp();
  const [view, setView] = useState<Feedback | null>(null);
  const avg = (k: keyof Feedback) => (feedback.reduce((s, f) => s + (f[k] as number), 0) / Math.max(feedback.length, 1)).toFixed(1);

  const trend = [
    { month: "Jan", r: 4.0 }, { month: "Feb", r: 4.1 }, { month: "Mar", r: 4.3 },
    { month: "Apr", r: 3.9 }, { month: "May", r: 4.2 }, { month: "Jun", r: 4.4 },
  ];
  const ghRating = [{ gh: "Vasundra", r: 4.4 }, { gh: "Dangoti", r: 4.1 }];

  const cols: Column<Feedback>[] = [
    { key: "e", header: "Employee", render: (f) => f.employeeName },
    { key: "b", header: "Booking", render: (f) => <span className="font-mono text-xs">{f.bookingId}</span> },
    { key: "g", header: "Guest House", render: (f) => f.guestHouseName },
    { key: "r", header: "Rating", render: (f) => <span className="inline-flex items-center gap-1"><Star className="size-3.5 fill-warning text-warning" /> {f.overall}/5</span> },
    { key: "w", header: "Website", render: (f) => `${f.website}/5` },
    { key: "c", header: "Comments", render: (f) => <span className="line-clamp-1 max-w-xs">{f.comments}</span> },
    { key: "d", header: "Submitted", render: (f) => formatDate(f.submittedAt) },
    { key: "s", header: "Sentiment", render: (f) => <StatusBadge status={f.sentiment} /> },
    { key: "act", header: "", render: (f) => <Button size="sm" variant="secondary" onClick={() => setView(f)}>View Full</Button> },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <PageHeader title="Feedback Review" subtitle="Track sentiment and ratings across the guest houses." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Average Rating" value={`${avg("overall")} / 5`} icon={Star} tone="warning" />
        <StatCard label="Cleanliness Score" value={`${avg("cleanliness")} / 5`} icon={Sparkles} tone="success" />
        <StatCard label="Room Comfort" value={`${avg("comfort")} / 5`} icon={ThumbsUp} tone="info" />
        <StatCard label="Website Experience" value={`${avg("website")} / 5`} icon={ThumbsDown} tone="primary" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Rating trend"><ResponsiveContainer>
          <LineChart data={trend}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" fontSize={12} /><YAxis domain={[0, 5]} fontSize={12} /><Tooltip /><Line dataKey="r" stroke="#f59e0b" strokeWidth={2} /></LineChart>
        </ResponsiveContainer></ChartCard>
        <ChartCard title="Guest house-wise rating"><ResponsiveContainer>
          <BarChart data={ghRating}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="gh" fontSize={12} /><YAxis domain={[0, 5]} fontSize={12} /><Tooltip /><Bar dataKey="r" fill="#1e40af" radius={[6, 6, 0, 0]} /></BarChart>
        </ResponsiveContainer></ChartCard>
      </div>
      <DataTable columns={cols} rows={feedback} />

      <Modal open={!!view} onClose={() => setView(null)} title={view ? `Feedback ${view.id}` : ""} footer={<Button onClick={() => setView(null)}>Close</Button>}>
        {view && (
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Row k="Employee" v={view.employeeName} /><Row k="Booking" v={view.bookingId} />
            <Row k="Guest House" v={view.guestHouseName} /><Row k="Sentiment" v={<StatusBadge status={view.sentiment} />} />
            <Row k="Overall" v={`${view.overall}/5`} /><Row k="Cleanliness" v={`${view.cleanliness}/5`} />
            <Row k="Comfort" v={`${view.comfort}/5`} /><Row k="Staff" v={`${view.staff}/5`} />
            <Row k="Website" v={`${view.website}/5`} /><Row k="Submitted" v={formatDate(view.submittedAt)} />
            <div className="sm:col-span-2"><dt className="text-muted-foreground text-xs">Comments</dt><dd>{view.comments}</dd></div>
            {view.suggestions && <div className="sm:col-span-2"><dt className="text-muted-foreground text-xs">Suggestions</dt><dd>{view.suggestions}</dd></div>}
          </dl>
        )}
      </Modal>
    </DashboardLayout>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) { return (<><dt className="text-muted-foreground text-xs">{k}</dt><dd className="font-medium">{v}</dd></>); }
