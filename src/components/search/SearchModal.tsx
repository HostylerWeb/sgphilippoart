"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { formatMessage } from "@/i18n/format-message";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./SearchModal.module.css";

type SearchLabels = Dictionary["search"];

type SearchResult = {
  slug: string;
  title: string;
  imageUrl: string;
  imageAlt: string | null;
  price: string;
  isSold: boolean;
};

type SearchModalProps = {
  labels: SearchLabels;
  onNavigate?: () => void;
};

const MIN_QUERY_LENGTH = 2;

export function SearchModal({ labels, onNavigate }: SearchModalProps) {
  const [open, setOpen] = useState(false);
  const mounted = useIsClient();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    window.setTimeout(() => {
      if (cancelled) return;
      setLoading(true);
    }, 0);

    void (async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
          signal: controller.signal,
        });

        if (!response.ok || cancelled) {
          return;
        }

        const data = (await response.json()) as {
          total: number;
          results: SearchResult[];
        };

        if (cancelled) return;

        setResults(data.results);
        setTotal(data.total);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (!cancelled) {
          setResults([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debouncedQuery]);

  function resetSearch() {
    setQuery("");
    setDebouncedQuery("");
    setResults([]);
    setTotal(0);
    setLoading(false);
  }

  function close() {
    setOpen(false);
    resetSearch();
    onNavigate?.();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) return;
    close();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function openResult(slug: string) {
    close();
    router.push(`/products/${slug}`);
  }

  const trimmed = query.trim();
  const showStartHint = trimmed.length === 0;
  const showMinChars = trimmed.length > 0 && trimmed.length < MIN_QUERY_LENGTH;
  const showNoResults =
    !loading &&
    debouncedQuery.length >= MIN_QUERY_LENGTH &&
    debouncedQuery === trimmed &&
    total === 0;
  const showResults =
    !loading &&
    debouncedQuery.length >= MIN_QUERY_LENGTH &&
    debouncedQuery === trimmed &&
    results.length > 0;

  const modal =
    mounted &&
    open &&
    createPortal(
      <div className={styles.overlay} onClick={close}>
        <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
          <div className={styles.modalHead}>
            <h2>{labels.title}</h2>
            <button type="button" aria-label={labels.close} onClick={close}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.searchForm}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.placeholder}
              autoFocus
              autoComplete="off"
              aria-controls="search-results"
            />
            <button type="submit">{labels.submit}</button>
          </form>

          <div id="search-results" className={styles.resultsPanel} aria-live="polite">
            {loading && <p className={styles.status}>{labels.searching}</p>}

            {showStartHint && !loading && (
              <p className={styles.status}>{labels.startTyping}</p>
            )}

            {showMinChars && !loading && (
              <p className={styles.status}>{labels.minChars}</p>
            )}

            {showNoResults && (
              <p className={styles.status}>
                {formatMessage(labels.noResults, { query: trimmed })}
              </p>
            )}

            {showResults && (
              <>
                <p className={styles.resultMeta}>
                  {formatMessage(
                    total === 1 ? labels.resultCount : labels.resultCountPlural,
                    { count: total },
                  )}
                </p>
                <ul className={styles.results}>
                  {results.map((result) => (
                    <li key={result.slug}>
                      <button
                        type="button"
                        className={styles.resultItem}
                        onClick={() => openResult(result.slug)}
                      >
                        <span className={styles.resultThumb}>
                          {result.imageUrl ? (
                            <Image
                              src={result.imageUrl}
                              alt={result.imageAlt ?? result.title}
                              fill
                              sizes="56px"
                            />
                          ) : null}
                        </span>
                        <span className={styles.resultCopy}>
                          <span className={styles.resultTitle}>{result.title}</span>
                          <span className={styles.resultPrice}>
                            {result.isSold ? labels.sold : result.price}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {total > results.length && (
                  <Link
                    href={`/search?q=${encodeURIComponent(trimmed)}`}
                    className={styles.viewAll}
                    onClick={close}
                  >
                    {labels.viewAll}
                  </Link>
                )}
              </>
            )}
          </div>

          <p className={styles.hint}>
            {labels.browse}{" "}
            <Link href="/collections" onClick={close}>
              {labels.allCollections}
            </Link>
          </p>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <button
        type="button"
        aria-label={labels.submit}
        className={styles.trigger}
        onClick={() => setOpen(true)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.6" y2="16.6" />
        </svg>
      </button>
      {modal}
    </>
  );
}
