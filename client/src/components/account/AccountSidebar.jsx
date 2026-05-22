import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const ITEMS = [
  { key: 'profile',   label: 'Profile',          icon: '👤' },
  { key: 'security',  label: 'Security',         icon: '🔒' },
  { key: 'addresses', label: 'Addresses',        icon: '📍' },
  { key: 'orders',    label: 'My Orders',        icon: '📦' },
  { key: 'account',   label: 'Account Info',     icon: '⚙️' },
];

const AccountSidebar = ({ current, onChange }) => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Log out of your account?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <aside className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-5
                      flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700
                        flex items-center justify-center text-2xl font-bold mb-2
                        overflow-hidden">
          {user?.avatar
            ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            : (user?.name?.[0] || 'U').toUpperCase()}
        </div>
        <p className="font-semibold text-gray-900">{user?.name}</p>
        <p className="text-xs text-gray-500 truncate w-full">{user?.email}</p>
      </div>

      <nav className="bg-white rounded-2xl border border-gray-200 p-2">
        {ITEMS.map((it) => (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm
                       flex items-center gap-2 transition
                       ${current === it.key
                         ? 'bg-blue-50 text-blue-700 font-semibold'
                         : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span>{it.icon}</span> {it.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm
                     flex items-center gap-2 text-red-600 hover:bg-red-50
                     mt-1 border-t pt-3"
        >
          🚪 Log out
        </button>
      </nav>
    </aside>
  );
};

export default AccountSidebar;

