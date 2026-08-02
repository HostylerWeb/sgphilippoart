"use client";

import { useActionState } from "react";
import {
  createTestimonialAction,
  deleteTestimonialAction,
  updateTestimonialAction,
} from "@/actions/admin/testimonials";
import formStyles from "@/components/forms/Form.module.css";
import { TranslationFields } from "@/components/admin/TranslationFields";
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
  };
};

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const action = testimonial
    ? updateTestimonialAction.bind(null, testimonial.id)
    : createTestimonialAction;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}

      <label>
        Review title
        <input name="title" defaultValue={testimonial?.title} required />
      </label>

      <label>
        Review body
        <textarea name="body" rows={5} defaultValue={testimonial?.body} required />
      </label>

      <TranslationFields
        fields={[
          { name: "title", label: "Review title" },
          { name: "body", label: "Review body", type: "textarea", rows: 5 },
        ]}
        values={testimonial?.translationValues}
      />

      <div className={formStyles.gridTwo}>
        <label>
          Author name
          <input name="author_name" defaultValue={testimonial?.author_name} required />
        </label>
        <label>
          Star rating
          <select name="rating" defaultValue={testimonial?.rating ?? 5}>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} stars
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Profile photo URL
        <input
          name="author_image_url"
          type="url"
          placeholder="https://…"
          defaultValue={testimonial?.author_image_url ?? ""}
        />
      </label>

      <label>
        Sort order
        <input name="sort_order" type="number" min="0" defaultValue={testimonial?.sort_order ?? 0} />
      </label>

      <div className={styles.checkboxes}>
        <label className={styles.checkbox}>
          <input name="is_verified" type="checkbox" defaultChecked={testimonial?.is_verified ?? true} />
          Verified buyer
        </label>
        <label className={styles.checkbox}>
          <input name="is_published" type="checkbox" defaultChecked={testimonial?.is_published ?? true} />
          Published on homepage
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? "Saving…" : testimonial ? "Save review" : "Create review"}
        </button>
        {testimonial && (
          <button
            type="submit"
            formAction={deleteTestimonialAction.bind(null, testimonial.id)}
            className={styles.deleteBtn}
            disabled={pending}
          >
            Delete review
          </button>
        )}
      </div>
    </form>
  );
}
