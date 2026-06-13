/**
 * Button — three variants only.
 *
 * variant='primary'   → solid Charcoal (default for most actions)
 * variant='secondary' → 1px Charcoal border, no fill
 * variant='final'     → solid Indigo (reserved for Add to Cart / Checkout)
 */
const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center px-6 py-3 rounded-soft ' +
    'text-sm font-semibold uppercase tracking-[0.08em] ' +
    'transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed';

  const styles = {
    primary:   'bg-charcoal text-white hover:bg-charcoal-soft',
    secondary: 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white',
    final:     'bg-primary text-white hover:bg-primary-hover',
  };

  return (
    <button type={type} className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;