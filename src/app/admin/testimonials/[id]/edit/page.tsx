import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { getFrenchTranslations } from "@/lib/i18n/content";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditTestimonialPage({ params }: PageProps) {
  const { id } = await params;
  const testimonial = await db.testimonials.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <StorefrontShell>
      <AdminShell
        title="Edit review"
        description={testimonial.title}
        activePath="/admin/testimonials"
      >
        <TestimonialForm
          testimonial={{
            ...testimonial,
            translationValues: getFrenchTranslations(testimonial),
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
