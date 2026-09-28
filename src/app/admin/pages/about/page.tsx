import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { AboutPageForm } from "@/components/admin/AboutPageForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getAboutPageFormValues } from "@/lib/cms/about-page";
import { getAdminLabels } from "@/lib/admin-dict";
import styles from "../../products/page.module.css";

export default async function AdminAboutPageEditor() {
  const [values, admin] = await Promise.all([getAboutPageFormValues(), getAdminLabels()]);
  const p = admin.pages.aboutEditor;

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={p.description}
        activePath="/admin/pages/about"
        actions={
          <Link href="/about" className={styles.addBtn} target="_blank">
            {admin.common.view}
          </Link>
        }
      >
        <AboutPageForm values={values} />
      </AdminShell>
    </StorefrontShell>
  );
}
