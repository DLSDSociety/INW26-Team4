import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';

import {
  loadProducts,
  loadCategories,
} from '../features/products/productSlice';

import useDebounce from '../hooks/useDebounce';

import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/product/Pagination';

const ProductListPage = () => {
  const dispatch = useDispatch();

  const {
    list,
    page,
    pages,
    total,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [searchParams, setSearchParams] = useSearchParams();

  // ── Local filter state (initialized from URL) ──────────────
  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  );

  const [category, setCategory] = useState(
    searchParams.get('category') || 'all'
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get('minPrice') || ''
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get('maxPrice') || ''
  );

  const [sort, setSort] = useState(
    searchParams.get('sort') || 'newest'
  );

  const [pageNum, setPageNum] = useState(
    Number(searchParams.get('page')) || 1
  );

  // ── New UI-only state (front-end filtering only for now) ──
  // Wire to backend later by adding `size` & `color` to your
  // productSlice thunk and the GET /api/products query string.
  const [size, setSize] = useState(searchParams.get('size') || '');
  const [color, setColor] = useState(searchParams.get('color') || '');

  // ── Debounced search ──────────────────────────────────────
  const debouncedSearch = useDebounce(search, 400);

  // ── Load categories once on mount ─────────────────────────
  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  // ── Sync filters to URL + fetch products ──────────────────
  useEffect(() => {
    const params = {
      search: debouncedSearch,
      category,
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 999999,
      sort,
      page: pageNum,
      limit: 12,
    };

    // Build clean URL params
    const urlParams = {};

    if (debouncedSearch) urlParams.search = debouncedSearch;
    if (category !== 'all') urlParams.category = category;
    if (minPrice) urlParams.minPrice = minPrice;
    if (maxPrice) urlParams.maxPrice = maxPrice;
    if (sort !== 'newest') urlParams.sort = sort;
    if (pageNum > 1) urlParams.page = pageNum;
    if (size) urlParams.size = size;
    if (color) urlParams.color = color;

    setSearchParams(urlParams, { replace: true });

    dispatch(loadProducts(params));
  }, [
    dispatch,
    debouncedSearch,
    category,
    minPrice,
    maxPrice,
    sort,
    pageNum,
    size,
    color,
    setSearchParams,
  ]);

  // ── Filter handlers (reset pagination together) ───────────
  const handleSearchChange    = (v) => { setSearch(v);    setPageNum(1); };
  const handleCategoryChange  = (v) => { setCategory(v);  setPageNum(1); };
  const handleMinPriceChange  = (v) => { setMinPrice(v);  setPageNum(1); };
  const handleMaxPriceChange  = (v) => { setMaxPrice(v);  setPageNum(1); };
  const handleSortChange      = (v) => { setSort(v);      setPageNum(1); };
  const handleSizeChange      = (v) => { setSize(v);      setPageNum(1); };
  const handleColorChange     = (v) => { setColor(v);     setPageNum(1); };

  // ── Reset all filters ─────────────────────────────────────
  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSize('');
    setColor('');
    setPageNum(1);
  };

  const hasActiveFilters =
    search || category !== 'all' || minPrice || maxPrice ||
    size || color || sort !== 'newest';

  return (
    <div className="max-w-container mx-auto px-margin-desktop py-16">

      {/* ─── Editorial Header ─────────────────────────────── */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div className="max-w-xl">
          <h1 className="text-display-md text-charcoal">Curated Edit</h1>
          <p className="mt-4 text-base text-on-surface-2">
            Precision-cut silhouettes and artisan textiles define this
            season's exploration of modern sartorialism.
          </p>
        </div>

        <SortDropdown sort={sort} setSort={handleSortChange} />
      </header>

      {/* ─── Two-Column Grid ──────────────────────────────── */}
      <div className="grid grid-cols-12 gap-gutter">

        {/* ── Sidebar — 3 cols on desktop, sticky ───────── */}
        <aside className="col-span-12 md:col-span-3">
          <div className="sticky top-24 space-y-10">

            {/* Subtle search inside the filter rail */}
            <div>
              <label htmlFor="filter-search" className="label-editorial mb-3 block">
                Search
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-2"
                />
                <input
                  id="filter-search"
                  type="search"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search edit…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-soft
                             border border-outline-soft bg-transparent text-sm
                             placeholder:text-on-surface-2
                             focus:outline-none focus:ring-2 focus:ring-primary/30
                             focus:border-primary"
                />
              </div>
            </div>

            <ProductFilters
              category={category}    setCategory={handleCategoryChange}
              minPrice={minPrice}    setMinPrice={handleMinPriceChange}
              maxPrice={maxPrice}    setMaxPrice={handleMaxPriceChange}
              size={size}            setSize={handleSizeChange}
              color={color}          setColor={handleColorChange}
            />

            {/* Reset link — only appears when something is active */}
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-xs uppercase tracking-[0.08em] text-on-surface-2
                           underline hover:text-primary transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* ── Product Section — 9 cols on desktop ───────── */}
        <section className="col-span-12 md:col-span-9">

          {/* Result count — small, editorial */}
          {!loading && (
            <p className="label-editorial mb-6">
              <span className="text-charcoal">{list.length}</span>
              <span className="text-on-surface-2"> of {total} pieces</span>
            </p>
          )}

          {error && (
            <div className="bg-error-container/40 border border-error/20
                            text-on-error-container rounded-soft
                            px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <ProductGrid
            products={list}
            loading={loading}
          />

          <Pagination
            page={page}
            pages={pages}
            onChange={setPageNum}
          />
        </section>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
 * Sort Dropdown — pill-shaped, sits in the page header
 * ────────────────────────────────────────────────────────── */
const SortDropdown = ({ sort, setSort }) => (
  <div className="relative shrink-0">
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      aria-label="Sort products"
      className="appearance-none pl-5 pr-10 py-2.5 rounded-full
                 border border-outline-soft bg-transparent text-sm text-charcoal
                 focus:outline-none focus:ring-2 focus:ring-primary/30
                 cursor-pointer"
    >
      <option value="newest">Sort: Newest</option>
      <option value="priceAsc">Sort: Price ↑</option>
      <option value="priceDesc">Sort: Price ↓</option>
      <option value="ratingDesc">Sort: Top Rated</option>
    </select>
    <span className="absolute right-4 top-1/2 -translate-y-1/2
                     pointer-events-none text-on-surface-2 text-xs">
      ▾
    </span>
  </div>
);

export default ProductListPage;