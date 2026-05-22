import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

const AdminProductCreatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();              // present only on /admin/products/:id/edit
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category: '', brand: '',
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);  // wait for product fetch in edit mode

  // In edit mode, load the existing product on mount and pre-fill the form.
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data?.product ?? res.data;   // tolerate either response shape
        setForm({
          name:        p.name        ?? '',
          description: p.description ?? '',
          price:       p.price       ?? '',
          stock:       p.stock       ?? '',
          category:    p.category    ?? '',
          brand:       p.brand       ?? '',
        });
      } catch {
        /* interceptor toasted */
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      // Only append images when the admin picked new ones.
      // In edit mode, an empty file input means "keep current images".
      files.forEach((f) => fd.append('images', f));

      if (isEdit) {
        await api.put(`/products/${id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch {
      /* interceptor toasted */
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-gray-500 py-10">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Product' : 'Add Product'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border">
        {['name', 'brand', 'category'].map((f) => (
          <div key={f}>
            <label className="block text-sm font-medium mb-1 capitalize">{f}</label>
            <input
              name={f} value={form[f]} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange} rows={3} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number" name="price" value={form.price} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number" name="stock" value={form.stock} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Images
            {isEdit && (
              <span className="text-gray-400 font-normal">
                {' '}(leave empty to keep existing)
              </span>
            )}
          </label>
          <input
            type="file" multiple accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="w-full text-sm"
          />
          {files.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{files.length} file(s) selected</p>
          )}
        </div>

        <button
          type="submit" disabled={submitting}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting
            ? (isEdit ? 'Saving…' : 'Creating…')
            : (isEdit ? 'Save Changes' : 'Create Product')}
        </button>
      </form>
    </div>
  );
};

export default AdminProductCreatePage;