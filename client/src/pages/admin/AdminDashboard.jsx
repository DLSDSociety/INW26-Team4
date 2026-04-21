export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '—', icon: '👤' },
    { label: 'Total Products', value: '—', icon: '📦' },
    { label: 'Total Orders', value: '—', icon: '🛒' },
    { label: 'Revenue', value: '—', icon: '💰' },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Full charts and stats coming in Week 9.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center gap-4"
          >
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-10">
        ⚠️ Full admin features (charts, tables, management) will be built in Weeks 8–9.
      </p>
    </div>
  )
}