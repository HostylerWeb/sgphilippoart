import { AuthorAvatar } from "@/components/ui/AuthorAvatar";
import { StarRating } from "@/components/ui/StarRating";
import styles from "./Testimonials.module.css";

export type TestimonialData = {
  id: string;
  title: string;
  body: string;
  author_name: string;
  author_image_url: string | null;
  is_verified: boolean;
  rating: number;
};

type TestimonialsProps = {
  testimonials: TestimonialData[];
  labels: {
    testimonialsEyebrow: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    verified: string;
    starRatingAria: string;
  };
};

export function Testimonials({ testimonials, labels }: TestimonialsProps) {
  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.sectionHead}>
          <span className="eyebrow">{labels.testimonialsEyebrow}</span>
          <h2 className={styles.sectionTitle}>{labels.testimonialsTitle}</h2>
          <p className={styles.sectionSubtitle}>{labels.testimonialsSubtitle}</p>
        </div>

        <div className={styles.testiGrid}>
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className={styles.testiCard}>
              <header className={styles.testiHeader}>
                <AuthorAvatar
                  name={testimonial.author_name}
                  imageUrl={testimonial.author_image_url}
                  size={42}
                />
                <div className={styles.testiAuthor}>
                  <div className={styles.authorRow}>
                    <span className={styles.author}>{testimonial.author_name}</span>
                    <StarRating
                      rating={testimonial.rating}
                      size={12}
                      ariaLabel={labels.starRatingAria.replace(
                        "{rating}",
                        testimonial.rating.toFixed(1),
                      )}
                    />
                  </div>
                  {testimonial.is_verified && (
                    <span className={styles.verified}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {labels.verified}
                    </span>
                  )}
                </div>
              </header>

              <h3 className={styles.testiTitle}>{testimonial.title}</h3>
              <blockquote className={styles.testiBody}>&ldquo;{testimonial.body}&rdquo;</blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
