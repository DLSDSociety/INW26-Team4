import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { selectWishlistCount } from '../../features/wishlist/wishlistSlice';

import IconButton from '../ui/IconButton';


const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart?.items?.length || 0);
  const wishlistCount = useSelector(selectWishlistCount);


  // ── Search state ─────────────────────────────────
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      navigate('/products');         // empty submit → show all
      return;
    }
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setQuery('');                    // clear after submit (optional)
  };

  const navLinks = [
    { to: '/products',     label: 'Collections' },
    { to: '/new-arrivals', label: 'New Arrivals' },
    { to: '/boutique',     label: 'Boutique' },
    { to: '/editorial',    label: 'Editorial' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-soft">
      <div className="max-w-container mx-auto px-margin-desktop py-5 flex items-center gap-12">

        {/* Brand wordmark */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-charcoal shrink-0">
          ShopMERN
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `link-underline text-sm font-medium text-on-surface ${isActive ? 'active text-primary' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Search pill — now a real form */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md ml-auto" role="search">
          <div className="relative">
            <button
              type="submit"
              aria-label="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-2
                         hover:text-primary transition"
            >
              <Search size={16} />
            </button>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collection..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-surface-3
                         text-sm placeholder:text-on-surface-2
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </form>

        {/* Icon trio */}
        
        <div className="flex items-center gap-1">

          <Link
  to='/wishlist'
  className='relative hover:text-blue-200 transition flex items-center gap-1'
>
 <IconButton ariaLabel="Wishlist">
            <Heart size={20} strokeWidth={1.5} />
          </IconButton>
  {wishlistCount > 0 && (
    <span className='absolute -top-2 -right-3 bg-white
                     text-red-500 text-xs font-bold rounded-full
                     w-5 h-5 flex items-center justify-center'>
      {wishlistCount}
    </span>
  )}
</Link>

          
          <Link to="/cart">
            <IconButton ariaLabel="Shopping bag" count={cartCount}>
              <ShoppingBag size={20} strokeWidth={1.5} />
            </IconButton>
          </Link>
          <Link to={isAuthenticated ? '/dashboard' : '/login'}>
            <IconButton ariaLabel="Account">
              <User size={20} strokeWidth={1.5} />
            </IconButton>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;