import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";
import { login as authLogin } from "@/services/authService";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { role?: Role } => ({
    role: s.role === "admin" ? "admin" : s.role === "employee" ? "employee" : undefined,
  }),
  component: LoginPage,
  head: () => ({ meta: [{ title: "Login — NFL Guest House" }] }),
});

function LoginPage() {
  const { role: defaultRole } = Route.useSearch();
  const navigate = useNavigate();
  const { login } = useApp();
  const [role, setRole] = useState<Role>(defaultRole ?? "employee");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ id?: string; pw?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  const submit = async (e: React.FormEvent) => {
  e.preventDefault();
  const errs: typeof errors = {};
  if (!identifier.trim()) errs.id = "Employee ID or email is required";
  if (!password.trim()) errs.pw = "Password is required";
  if (Object.keys(errs).length) { setErrors(errs); return; }

  setLoading(true);
  setErrors({});

  try {
    const { user, profile } = await authLogin({ identifier, password, role });
    
    // Map Supabase profile to Employee shape the app expects
    // Map Supabase profile to Employee shape the app expects
    // Map Supabase profile to Employee shape the app expects
const categoryMap: Record<string, "Executive Employee" | "Non-Executive Employee"> = {
  A: "Executive Employee",
  B: "Executive Employee", 
  C: "Non-Executive Employee",
};

const employeeData = {
  id: user.id,
  name: profile.full_name || user.email || "User",
  email: user.email || "",
  role: (profile.role === "hr" ? "admin" : profile.role) as Role,
  department: profile.department || "",
  designation: profile.designation || "",
  category: categoryMap[profile.category] || "Non-Executive Employee",
};

    login(employeeData);
    
    const destination = profile.role === "admin" || profile.role === "hr" 
      ? "/admin/dashboard" 
      : "/employee/dashboard";
      
    navigate({ to: destination });
    
  } catch (err: any) {
    setErrors({ general: err.message || "Login failed. Check your credentials." });
  } finally {
    setLoading(false);
  }
};

  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Login to access the NFL Guest House Management System</p>
          <div className="mt-6 grid grid-cols-2 rounded-lg bg-muted p-1">
            {(["employee", "admin"] as Role[]).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={cn("py-2 rounded-md text-sm font-medium transition", role === r ? "bg-card shadow text-foreground" : "text-muted-foreground")}>
                {r === "admin" ? "Admin / HR" : "Employee"}
              </button>
            ))}
          </div>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <FormInput 
              label={role === "admin" ? "Admin ID / Email" : "Employee ID / Email"} 
              placeholder={role === "admin" ? "Enter admin ID or email" : "Enter your employee ID or email"} 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              error={errors.id} 
            />
            <FormInput 
              label="Password" 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              error={errors.pw} 
            />
            {errors.general && (
              <p className="text-sm text-red-500">{errors.general}</p>
            )}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <button type="button" onClick={() => setForgot(true)} className="text-primary hover:underline">
                Forgot password?
              </button>
            </div>
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Link to="/"><Button type="button" variant="secondary" fullWidth>Back to Home</Button></Link>
          </form>
        </div>
        <div className="hidden lg:block">
          <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80" alt="Hotel" className="rounded-2xl shadow-xl" />
        </div>
      </section>
      <Modal open={forgot} onClose={() => setForgot(false)} title="Password Reset" footer={<Button onClick={() => setForgot(false)}>Close</Button>}>
        <p className="text-sm text-foreground/80">Password reset will be handled by the backend/admin team.</p>
      </Modal>
    </PublicLayout>
  );
}