"use client";

import { useActionState } from "react";
import {
  createTestimonialAction,
  deleteTestimonialAction,
  updateTestimonialAction,
} from "@/actions/admin/testimonials";
import { TranslationFields } from "@/components/admin/TranslationFields";
import { useI18n } from "@/components/layout/I18nProvider";
import { formatMessage } from "@/i18n/format-message";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./ContentForms.module.css";

type TestimonialFormProps = {
  testimonial?: {
    id: string;
    title: string;
    body: string;
    author_name: string;
    author_image_url: string | null;
    rating: number;
    sort_order: number;
    is_verified: boolean;
    is_published: boolean;
    translationValues?: Record<string, string>;
    translationValuesNl?: Record<string, string>;
  };
};

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms.testimonial;
  const pf = dict.admin.forms.product;
  const saving = dict.admin.common.saving;

  const action = testimonial
    ? updateTestimonialAction.bind(null, testimonial.id)
    : createTestimonialAction;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}

      <label>
        {f.reviewTitle}
        <input name="title" defaultValue={testimonial?.title} required />
      </label>

      <label>
        {f.reviewBody}
        <textarea name="body" rows={5} defaultValue={testimonial?.body} required />
      </label>

      <TranslationFields
        locale="fr"
        title={pf.frenchTranslations}
        hint={pf.translationHint}
        fields={[
          { name: "title", label: f.reviewTitle },
          { name: "body", label: f.reviewBody, type: "textarea", rows: 5 },
        ]}
        values={testimonial?.translationValues}
      />

      <TranslationFields
        locale="nl"
        title={pf.dutchTranslations}
        hint={pf.translationHint}
        fields={[
          { name: "title", label: f.reviewTitle },
          { name: "body", label: f.reviewBody, type: "textarea", rows: 5 },
        ]}
        values={testimonial?.translationValuesNl}
      />

      <div className={formStyles.gridTwo}>
        <label>
          {f.authorName}
          <input name="author_name" defaultValue={testimonial?.author_name} required />
        </label>
        <label>
          {f.starRating}
          <select name="rating" defaultValue={testimonial?.rating ?? 5}>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {formatMessage(f.stars, { count: value })}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        {f.profilePhotoUrl}
        <input
          name="author_image_url"
          type="url"
          placeholder="https://…"
          defaultValue={testimonial?.author_image_url ?? ""}
        />
      </label>

      <label>
        {f.sortOrder}
        <input name="sort_order" type="number" min="0" defaultValue={testimonial?.sort_order ?? 0} />
      </label>

      <div className={styles.checkboxes}>
        <label className={styles.checkbox}>
          <input name="is_verified" type="checkbox" defaultChecked={testimonial?.is_verified ?? true} />
          {f.verifiedBuyer}
        </label>
        <label className={styles.checkbox}>
          <input name="is_published" type="checkbox" defaultChecked={testimonial?.is_published ?? true} />
          {f.publishedHomepage}
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? saving : testimonial ? f.saveReview : f.createReview}
        </button>
        {testimonial && (
          <button
            type="submit"
            formAction={deleteTestimonialAction.bind(null, testimonial.id)}
            className={styles.deleteBtn}
            disabled={pending}
          >
            {f.deleteReview}
          </button>
        )}
      </div>
    </form>
  );
}
