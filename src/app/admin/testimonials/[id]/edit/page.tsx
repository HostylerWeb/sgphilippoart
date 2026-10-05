import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { adminEntityTranslationProps } from "@/lib/i18n/admin-edit-props";
import { getAdminLabels } from "@/lib/admin-dict";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditTestimonialPage({ params }: PageProps) {
  const { id } = await params;
  const [testimonial, admin] = await Promise.all([
    db.testimonials.findUnique({ where: { id } }),
    getAdminLabels(),
  ]);
  if (!testimonial) notFound();

  const { entity, translationValuesEn, translationValuesNl } =
    adminEntityTranslationProps(testimonial, "testimonial");

  return (
    <StorefrontShell>
      <AdminShell
        title={admin.pages.testimonials.edit}
        description={testimonial.title}
        activePath="/admin/testimonials"
      >
        <TestimonialForm
          testimonial={{
            ...entity,
            translationValuesEn,
            translationValuesNl,
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
