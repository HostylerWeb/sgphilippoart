"use client";

import { useState } from "react";
import styles from "./FaqAccordion.module.css";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.list}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className={styles.item}>
            <button
              type="button"
              className={styles.trigger}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <span className={styles.icon}>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <div className={styles.panel}>{item.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}
