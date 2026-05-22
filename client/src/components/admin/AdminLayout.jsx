import { NavLink, Outlet } from 'react-router-dom';
 
const links = [
  { to: '/admin',          label: 'Dashboard', end: true },
  { to: '/admin/orders',   label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/users',    label: 'Users' },
];
 
const AdminLayout = () => {
  const base =
    'block px-4 py-2.5 rounded-lg text-sm font-medium transition';
  const idle   = 'text-gray-600 hover:bg-gray-100';
  const active = 'bg-blue-600 text-white';
 
  return (
    <div className="max-w-7xl mx-auto px-4 py-8
                    flex flex-col md:flex-row gap-8">
      <aside className="md:w-56 shrink-0">
        <h2 className="text-xs font-semibold uppercase
                       tracking-wide text-gray-400 mb-3 px-1">
          Admin
        </h2>
        <nav className="space-y-1" aria-label="Admin navigation">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `${base} ${isActive ? active : idle}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
 
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};
 
export default AdminLayout;

