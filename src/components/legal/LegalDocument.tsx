import type { LegalPageContent } from "@/i18n/legal/types";
import styles from "./LegalDocument.module.css";

type LegalDocumentProps = {
  content: LegalPageContent;
};

function sectionAnchor(section: LegalPageContent["sections"][number], index: number) {
  return section.id ?? `section-${index + 1}`;
}

function sectionNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function LegalDocument({ content }: LegalDocumentProps) {
  return (
    <article className={styles.document}>
      {content.sections.map((section, index) => {
        const anchor = sectionAnchor(section, index);

        return (
          <section key={anchor} id={anchor} className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNumber} aria-hidden="true">
                {sectionNumber(index)}
              </span>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
            </div>

            <div className={styles.sectionBody}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}

              {section.list && (
                <ul className={styles.list}>
                  {section.list.map((item) => (
                    <li key={item.slice(0, 48)}>{item}</li>
                  ))}
                </ul>
              )}

              {section.table && (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {section.table.headers.map((header) => (
                          <th key={header} scope="col">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")}>
                          {row.map((cell) => (
                            <td key={cell}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </article>
  );
}
