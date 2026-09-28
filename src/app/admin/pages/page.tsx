import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getAdminLabels } from "@/lib/admin-dict";
import styles from "./page.module.css";

export default async function AdminPagesIndex() {
  const admin = await getAdminLabels();
  const p = admin.pages.contentHub;

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={p.description}
        activePath="/admin/pages"
      >
        <ul className={styles.list}>
          <li>
            <Link href="/admin/pages/about" className={styles.card}>
              <strong>{p.aboutTitle}</strong>
              <span>{p.aboutDescription}</span>
              <span className={styles.path}>/about</span>
            </Link>
          </li>
        </ul>
      </AdminShell>
    </StorefrontShell>
  );
}
