import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadAddresses, createAddress, editAddress, removeAddress, selectAddresses,
} from '../../features/user/userSlice';

const EMPTY = {
  label: 'Home', fullName: '', phone: '', address: '',
  city: '', state: '', postalCode: '', isDefault: false,
};

const FIELDS = [
  { label: 'Label (Home / Office)', name: 'label'      },
  { label: 'Full Name',             name: 'fullName'   },
  { label: 'Phone',                 name: 'phone'      },
  { label: 'Street Address',        name: 'address'    },
  { label: 'City',                  name: 'city'       },
  { label: 'State',                 name: 'state'      },
  { label: 'Postal Code',           name: 'postalCode' },
];

const AddressesTab = () => {
  const dispatch  = useDispatch();
  const addresses = useSelector(selectAddresses);
  const { loading, error } = useSelector((s) => s.user);

  const [form, setForm]       = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm]   = useState(false);

  useEffect(() => { dispatch(loadAddresses()); }, [dispatch]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => {
    setForm(EMPTY); setEditingId(null); setShowForm(true);
  };
  const openEdit = (a) => {
    setForm(a); setEditingId(a._id); setShowForm(true);
  };
  const cancel = () => {
    setForm(EMPTY); setEditingId(null); setShowForm(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const action = editingId
      ? editAddress({ id: editingId, data: form })
      : createAddress(form);
    const res = await dispatch(action);
    if (action.type.startsWith('user/') && (
        editAddress.fulfilled.match(res) || createAddress.fulfilled.match(res))) {
      cancel();
    }
  };

  const onDelete = (id) => {
    if (window.confirm('Delete this address?')) dispatch(removeAddress(id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
          <p className="text-sm text-gray-500">
            Pick one at checkout instead of typing it every time.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg
                       text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Add Address
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700
                        rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>
      )}

      {showForm && (
        <form onSubmit={onSubmit}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6
                         grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map(({ label, name }) => (
            <div key={name} className={name === 'address' ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                name={name} value={form[name]} onChange={onChange}
                required={['fullName','phone','address','city','postalCode'].includes(name)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <label className="sm:col-span-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox" name="isDefault"
              checked={form.isDefault} onChange={onChange}
            />
            Set as default address
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button
              type="submit" disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm
                         font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {editingId ? 'Save changes' : 'Add address'}
            </button>
            <button
              type="button" onClick={cancel}
              className="border border-gray-300 px-5 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="text-gray-500 text-center py-10">
          No saved addresses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a._id}
                 className="border border-gray-200 rounded-2xl p-4 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{a.label}</span>
                {a.isDefault && (
                  <span className="text-xs bg-blue-50 text-blue-700
                                   px-2 py-0.5 rounded-full font-medium">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-800">{a.fullName}</p>
              <p className="text-sm text-gray-600">{a.phone}</p>
              <p className="text-sm text-gray-600 mt-1">
                {a.address}, {a.city}
                {a.state ? `, ${a.state}` : ''} — {a.postalCode}
              </p>
              <div className="flex gap-3 mt-3 text-sm">
                <button onClick={() => openEdit(a)}
                        className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => onDelete(a._id)}
                        className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesTab;

