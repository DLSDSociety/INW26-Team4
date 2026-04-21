import { NavLink, Outlet } from 'react-router-dom'

const adminLinks = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/products', label: '📦 Products' },
  { to: '/admin/orders', label: '🧾 Orders' },
  { to: '/admin/users', label: '👥 Users' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-300 flex flex-col py-8 px-4 shrink-0">
        <h2 className="text-white font-bold text-lg mb-8 px-2">Admin Panel</h2>
        <nav className="space-y-1">
          {adminLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}