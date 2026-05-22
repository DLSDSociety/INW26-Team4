import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  const numbers = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(pages, start + 2);
  for (let i = start; i <= end; i++) numbers.push(i);

  const circleBtn = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition';

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-16">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${circleBtn} border border-outline-soft hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {numbers.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`${circleBtn} ${n === page ? 'bg-charcoal text-white' : 'text-charcoal hover:bg-surface-3'}`}
        >
          {n}
        </button>
      ))}

      {end < pages && <span className="px-2 text-on-surface-2">…</span>}
      {end < pages && (
        <button
          onClick={() => onChange(pages)}
          className={`${circleBtn} text-charcoal hover:bg-surface-3`}
        >
          {pages}
        </button>
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className={`${circleBtn} border border-outline-soft hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;