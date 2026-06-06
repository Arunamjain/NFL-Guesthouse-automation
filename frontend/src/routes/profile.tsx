import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const { currentUser, role, logout } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [name, setName] = useState(currentUser?.name ?? "");

  useEffect(() => { if (!currentUser) navigate({ to: "/login" }); }, [currentUser, navigate]);
  if (!currentUser || !role) return null;

  return (
    <DashboardLayout requiredRole={role}>
      <PageHeader title="My Profile" subtitle="Manage your account information and preferences" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <div className="size-24 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">{currentUser.name.charAt(0)}</div>
          <h2 className="mt-4 font-semibold">{currentUser.name}</h2>
          <p className="text-sm text-muted-foreground">{currentUser.designation}</p>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{currentUser.category}</span>
          <div className="mt-6 grid gap-2">
            <Button variant="secondary" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit Profile"}</Button>
            <Button variant="ghost" onClick={() => setPwModal(true)}>Change Password</Button>
            <Button variant="danger" onClick={() => { logout(); navigate({ to: "/login" }); }}>Logout</Button>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Account Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput label="Name" value={name} disabled={!editing} onChange={(e) => setName(e.target.value)} />
              <FormInput label="Employee ID" value={currentUser.id} disabled />
              <FormInput label="Email" value={currentUser.email} disabled />
              <FormInput label="Department" value={currentUser.department} disabled />
              <FormInput label="Designation" value={currentUser.designation} disabled />
              <FormInput label="Role" value={role === "admin" ? "Admin / HR" : "Employee"} disabled />
            </div>
            {editing && <div className="mt-4"><Button onClick={() => { toast.success("Profile update will be connected to backend."); setEditing(false); }}>Save Changes</Button></div>}
          </section>
          <section className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-2">Notification Preferences</h3>
            <div className="space-y-2 text-sm">
              {["Email notifications for booking updates", "Email alerts for payment verification", "Notifications for feedback requests"].map((l) => (
                <label key={l} className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded" /> {l}</label>
              ))}
            </div>
          </section>
          <section className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-2">Security Settings</h3>
            <p className="text-sm text-muted-foreground">Two-factor authentication, session management and audit logs will be enabled once backend is connected.</p>
          </section>
        </div>
      </div>
      <Modal open={pwModal} onClose={() => setPwModal(false)} title="Change Password" footer={<Button onClick={() => setPwModal(false)}>Close</Button>}>
        <p className="text-sm text-foreground/80">Password change will be handled by backend authentication.</p>
      </Modal>
    </DashboardLayout>
  );
}
