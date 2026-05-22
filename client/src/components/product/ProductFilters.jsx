import { useSelector } from 'react-redux';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PALETTE = [
  { name: 'multi',     hex: 'conic-gradient(from 0deg, #fff, #000, #fff)' },
  { name: 'ivory',     hex: '#f5efe6' },
  { name: 'grey',      hex: '#777683' },
  { name: 'brown',     hex: '#491a00' },
  { name: 'indigo',    hex: '#15157d' },
];

const ProductFilters = ({
  category, setCategory,
  maxPrice, setMaxPrice,
  size, setSize,
  color, setColor,
}) => {
  const { categories = [] } = useSelector((s) => s.products || {});

  return (
    <aside className="space-y-10">

      {/* Category */}
      <div>
        <h3 className="label-editorial mb-5">Category</h3>
        <ul className="space-y-3">
          {categories.map((c) => (
            <li key={c.name || c}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={category === (c.name || c)}
                  onChange={() => setCategory(category === (c.name || c) ? 'all' : (c.name || c))}
                  className="w-4 h-4 rounded-soft border border-outline text-primary
                             focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-sm text-charcoal group-hover:text-primary transition flex-1">
                  {c.name || c}
                </span>
                {c.count != null && (
                  <span className="text-xs text-on-surface-2">({String(c.count).padStart(2, '0')})</span>
                )}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h3 className="label-editorial mb-5">Price Range</h3>
        <input
          type="range"
          min="0"
          max="5000"
          value={maxPrice || 5000}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full accent-primary"
        />
        <div className="flex justify-between mt-3 text-xs text-on-surface-2">
          <span>₹0</span>
          <span>₹5,000+</span>
        </div>
      </div>

      {/* Size grid */}
      <div>
        <h3 className="label-editorial mb-5">Size</h3>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((s) => {
            const active = size === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSize(active ? '' : s)}
                className={`h-12 rounded-soft text-sm font-medium transition border
                           ${active
                             ? 'bg-charcoal text-white border-charcoal'
                             : 'bg-transparent text-charcoal border-outline-soft hover:border-charcoal'}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Palette */}
      <div>
        <h3 className="label-editorial mb-5">Palette</h3>
        <div className="flex gap-3 flex-wrap">
          {PALETTE.map((p) => {
            const active = color === p.name;
            return (
              <button
                key={p.name}
                type="button"
                aria-label={p.name}
                onClick={() => setColor(active ? '' : p.name)}
                className={`w-8 h-8 rounded-full border-2 transition
                           ${active ? 'border-primary' : 'border-outline-soft'}`}
                style={p.hex.startsWith('conic') ? { background: p.hex } : { backgroundColor: p.hex }}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default ProductFilters;