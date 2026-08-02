import type { LegalPageContent, LegalPageVars, LegalSection } from "@/i18n/legal/types";

function resolveString(template: string, vars: LegalPageVars): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function resolveSection(section: LegalSection, vars: LegalPageVars): LegalSection {
  return {
    ...section,
    title: resolveString(section.title, vars),
    paragraphs: section.paragraphs.map((paragraph) => resolveString(paragraph, vars)),
    list: section.list?.map((item) => resolveString(item, vars)),
    table: section.table
      ? {
          headers: section.table.headers.map((header) => resolveString(header, vars)),
          rows: section.table.rows.map((row) =>
            row.map((cell) => resolveString(cell, vars)),
          ),
        }
      : undefined,
  };
}

export function resolveLegalPage(
  content: LegalPageContent,
  vars: LegalPageVars,
): LegalPageContent {
  return {
    ...content,
    title: resolveString(content.title, vars),
    description: resolveString(content.description, vars),
    lastUpdated: resolveString(content.lastUpdated, vars),
    sections: content.sections.map((section) => resolveSection(section, vars)),
  };
}
