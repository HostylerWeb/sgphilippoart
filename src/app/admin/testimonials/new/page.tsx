import { AdminShell } from "@/components/layout/AdminShell";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminNewTestimonialPage() {
  const admin = await getAdminLabels();
  const p = admin.pages.testimonials;

  return (
    <StorefrontShell>
      <AdminShell
        title={p.add}
        description={p.newDescription}
        activePath="/admin/testimonials"
      >
        <TestimonialForm />
      </AdminShell>
    </StorefrontShell>
  );
}
