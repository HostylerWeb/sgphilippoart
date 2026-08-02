import { AdminShell } from "@/components/layout/AdminShell";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

export default async function AdminNewTestimonialPage() {
  return (
    <StorefrontShell>
      <AdminShell
        title="Add review"
        description="Create a testimonial for the homepage reviews section."
        activePath="/admin/testimonials"
      >
        <TestimonialForm />
      </AdminShell>
    </StorefrontShell>
  );
}
