import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../features/auth/authSlice';

const ProfileTab = () => {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const [saved, setSaved] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setSaved(false);

    const res = await dispatch(updateProfile(form));

    if (updateProfile.fulfilled.match(res)) {
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }
  };

  return (
    <div className="max-w-lg">

      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Profile
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Your name and email are visible on your orders.
      </p>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700
                     rounded-lg px-4 py-3 mb-4 text-sm"
        >
          {error}
        </div>
      )}

      {saved && (
        <div
          className="bg-green-50 border border-green-200 text-green-700
                     rounded-lg px-4 py-3 mb-4 text-sm"
        >
          Profile updated successfully.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            autoComplete="name"
            className="w-full border border-gray-300 rounded-lg
                       px-4 py-2.5 focus:outline-none
                       focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            autoComplete="email"
            className="w-full border border-gray-300 rounded-lg
                       px-4 py-2.5 focus:outline-none
                       focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar URL
          </label>

          <input
            type="url"
            name="avatar"
            value={form.avatar}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg
                       px-4 py-2.5 focus:outline-none
                       focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg
                     font-semibold hover:bg-blue-700 transition
                     disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

      </form>
    </div>
  );
};

export default ProfileTab;