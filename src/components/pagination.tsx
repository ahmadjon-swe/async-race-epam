import styles from './pagination.module.css';

interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}

export function Pagination({ page, total, perPage, onPrev, onNext, disabled }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.btn}
        onClick={onPrev}
        disabled={disabled || page <= 1}
      >
        Prev
      </button>
      <span className={styles.info}>
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={onNext}
        disabled={disabled || page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
