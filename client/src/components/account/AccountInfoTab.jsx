import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { deleteAccount } from '../../features/user/userAPI';

const AccountInfoTab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [open, setOpen]     = useState(false);
  const [pwd, setPwd]       = useState('');
  const [busy, setBusy]     = useState(false);
  const [err, setErr]       = useState('');

  const handleDelete = async () => {
    setBusy(true); setErr('');
    try {
      await deleteAccount(pwd);
      dispatch(logout());
      navigate('/');
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to delete account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Account Info</h2>
      <p className="text-sm text-gray-500 mb-6">
        Read-only details about your account.
      </p>

      <dl className="space-y-3 text-sm">
        <Row label="User ID"   value={user?._id} mono />
        <Row label="Name"      value={user?.name} />
        <Row label="Email"     value={user?.email} />
        <Row label="Role"      value={user?.role} />
        <Row label="Joined"    value={user?.createdAt
                                 ? new Date(user.createdAt).toLocaleDateString('en-IN')
                                 : '—'} />
      </dl>

      <hr className="my-8 border-gray-200" />

      <div className="border border-red-200 bg-red-50 rounded-2xl p-5">
        <h3 className="text-base font-bold text-red-700 mb-1">Danger Zone</h3>
        <p className="text-sm text-red-700/80 mb-4">
          Deleting your account is permanent. Past orders remain in the system
          for accounting purposes but your name and email are removed.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg
                     text-sm font-semibold hover:bg-red-700 transition"
        >
          Delete my account
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center
                        p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="font-bold text-lg mb-2">Confirm account deletion</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your current password to confirm.
            </p>
            <input
              type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}
              placeholder="Current password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
            />
            {err && (
              <p className="text-red-600 text-sm mb-3">{err}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setOpen(false); setPwd(''); setErr(''); }}
                className="border border-gray-300 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete} disabled={busy || !pwd}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm
                           font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                {busy ? 'Deleting…' : 'Delete forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value, mono }) => (
  <div className="flex justify-between border-b border-gray-100 py-2">
    <dt className="text-gray-500">{label}</dt>
    <dd className={mono ? 'font-mono text-xs text-gray-700' : 'text-gray-900'}>
      {value || '—'}
    </dd>
  </div>
);

export default AccountInfoTab;


