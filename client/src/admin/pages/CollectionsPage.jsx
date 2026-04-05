import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Plus, Edit, Trash2, Loader2, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

const defaultCollection = {
  name: '',
  slug: '',
  description: '',
  image: '',
  isActive: true,
  displayOrder: 0,
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(defaultCollection)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadCollections()
  }, [])

  async function loadCollections() {
    try {
      const res = await api.get('/api/admin/collections')
      setCollections(res.collections || res || [])
    } catch (err) {
      toast.error('Failed to load collections: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditId(null)
    setForm(defaultCollection)
    setShowModal(true)
  }

  function openEdit(c) {
    setEditId(c._id)
    setForm({
      name: c.name || '',
      slug: c.slug || '',
      description: c.description || '',
      image: c.image || '',
      isActive: c.isActive !== false,
      displayOrder: c.displayOrder || 0,
    })
    setShowModal(true)
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await api.post('/api/upload', fd)
      setForm((prev) => ({ ...prev, image: res.url || res.imageUrl || res.path }))
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
    e.target.value = ''
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name),
        displayOrder: Number(form.displayOrder) || 0,
      }
      if (editId) {
        await api.put(`/api/admin/collections/${editId}`, payload)
        toast.success('Collection updated')
      } else {
        await api.post('/api/admin/collections', payload)
        toast.success('Collection created')
      }
      setShowModal(false)
      loadCollections()
    } catch (err) {
      toast.error('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this collection?')) return
    try {
      await api.delete(`/api/admin/collections/${id}`)
      toast.success('Collection deleted')
      setCollections((prev) => prev.filter((c) => c._id !== id))
    } catch (err) {
      toast.error('Delete failed: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-charcoal font-heading">Collections</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-dark text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          New Collection
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Collection</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Products</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Order</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      No collections yet
                    </td>
                  </tr>
                ) : (
                  collections.map((c) => (
                    <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {c.image ? (
                            <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100" />
                          )}
                          <div>
                            <p className="font-medium text-charcoal">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{c.productCount || c.products?.length || 0}</td>
                      <td className="py-3 px-4 text-gray-600">{c.displayOrder || 0}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {c.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(c._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-charcoal">
                {editId ? 'Edit Collection' : 'New Collection'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: editId ? p.slug : slugify(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {form.image ? (
                  <div className="relative w-24 h-24 mb-2">
                    <img src={form.image} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, image: '' }))} className="absolute -top-1.5 -right-1.5 p-0.5 bg-white rounded-full shadow text-gray-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ) : null}
                <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                  {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm((p) => ({ ...p, displayOrder: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-gold focus:ring-gold"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-sm text-white bg-gold hover:bg-gold-dark rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
