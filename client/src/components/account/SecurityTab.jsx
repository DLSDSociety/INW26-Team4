import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../features/auth/authSlice';

const SecurityTab = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    currentPassword: '', newPassword: '', confirm: '',
  });
  const [done, setDone] = useState('');
  const [localError, setLocalError] = useState('');

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setDone(''); setLocalError('');

    if (form.newPassword.length < 6) {
      setLocalError('New password must be at least 6 characters');
      return;
    }
    if (form.newPassword !== form.confirm) {
      setLocalError('New password and confirmation do not match');
      return;
    }

    const res = await dispatch(changePassword({
      currentPassword: form.currentPassword,
      newPassword:     form.newPassword,
    }));
    if (changePassword.fulfilled.match(res)) {
      setDone('Password updated. Use the new one next time you log in.');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Security</h2>
      <p className="text-sm text-gray-500 mb-6">
        Use at least 6 characters. We never email you your password.
      </p>

      {(error || localError) && (
        <div className="bg-red-50 border border-red-200 text-red-700
                        rounded-lg px-4 py-3 mb-4 text-sm">
          {localError || error}
        </div>
      )}
      {done && (
        <div className="bg-green-50 border border-green-200 text-green-700
                        rounded-lg px-4 py-3 mb-4 text-sm">{done}</div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {[
          { label: 'Current Password', name: 'currentPassword' },
          { label: 'New Password',     name: 'newPassword'     },
          { label: 'Confirm New',      name: 'confirm'         },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="password" name={name} required
              value={form[name]} onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          type="submit" disabled={loading}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold
                     hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
};

export default SecurityTab;

