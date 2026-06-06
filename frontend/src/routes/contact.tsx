import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({ component: ContactPage, head: () => ({ meta: [{ title: "Contact — NFL Guest House" }] }) });

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", empId: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message submitted. Backend API will handle this later.");
    setForm({ name: "", email: "", empId: "", message: "" });
  };
  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-14 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Contact Us</h1>
          <p className="text-sm text-muted-foreground mt-1">Reach out for booking, HR, or technical assistance.</p>
          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
            <FormInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormInput label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <FormInput label="Employee ID" value={form.empId} onChange={(e) => setForm({ ...form, empId: e.target.value })} className="sm:col-span-2" />
            <div className="sm:col-span-2"><TextAreaField label="Message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            <div className="sm:col-span-2"><Button type="submit">Submit Message</Button></div>
          </form>
        </div>
        <div className="space-y-4">
          {[
            { i: Mail, t: "Email", v: "guesthouse-support@nfl.com" },
            { i: Phone, t: "Phone", v: "+91-00000-00000" },
            { i: MapPin, t: "Address", v: "NFL Corporate Guest House Desk" },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><c.i className="size-5" /></div>
              <div><div className="text-xs text-muted-foreground">{c.t}</div><div className="font-medium">{c.v}</div></div>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
