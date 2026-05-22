/**
 * Pill badge for product status (NEW, LIMITED, SOLD OUT).
 * - default: white text on charcoal
 * - indigo:  white text on deep indigo (use for LIMITED EDITION)
 */
const Badge = ({ children, variant = 'default', className = '' }) => {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em]';
  const styles = {
    default: 'bg-charcoal text-white',
    indigo:  'bg-primary text-white',
    outline: 'border border-charcoal text-charcoal',
  };
  return (
    <span className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;