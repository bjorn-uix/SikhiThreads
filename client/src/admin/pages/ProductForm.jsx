import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'wall_art', label: 'Wall Art' },
  { value: 'home_living', label: 'Home & Living' },
  { value: 'phone_tech', label: 'Phone & Tech' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'digital', label: 'Digital' },
  { value: 'books', label: 'Books' },
  { value: 'custom', label: 'Custom' },
]

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const defaultForm = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  price: '',
  compareAtPrice: '',
  category: 'wall_art',
  isDigital: false,
  digitalFileUrl: '',
  stock: '',
  collectionTags: '',
  images: [],
  isFeatured: false,
  isActive: true,
  seoTitle: '',
  seoDescription: '',
  variants: [],
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (isEdit) {
      setLoading(true)
      api
        .get(`/api/admin/products/${id}`)
        .then((res) => {
          const p = res.product || res
          setForm({
            name: p.name || '',
            slug: p.slug || '',
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            price: p.price ?? '',
            compareAtPrice: p.compareAtPrice ?? '',
            category: p.category || 'wall_art',
            isDigital: p.isDigital || false,
            digitalFileUrl: p.digitalFileUrl || '',
            stock: p.stock ?? '',
            collectionTags: Array.isArray(p.collectionTags)
              ? p.collectionTags.join(', ')
              : p.collectionTags || '',
            images: p.images || [],
            isFeatured: p.isFeatured || false,
            isActive: p.isActive !== false,
            seoTitle: p.seoTitle || '',
            seoDescription: p.seoDescription || '',
            variants: p.variants || [],
          })
        })
        .catch((err) => toast.error('Failed to load product: ' + err.message))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm((prev) => {
      const next = { ...prev, [name]: val }
      if (name === 'name' && !isEdit) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  async function uploadImages(files) {
    setUploading(true)
    try {
      const urls = []
      for (const file of files) {
        const fd = new FormData()
        fd.append('image', file)
        const res = await api.post('/api/upload', fd)
        urls.push(res.url || res.imageUrl || res.path)
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
      toast.success(`${urls.length} image(s) uploaded`)
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  function removeImage(idx) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    if (files.length) uploadImages(files)
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files)
    if (files.length) uploadImages(files)
    e.target.value = ''
  }

  // Variants
  function addVariant() {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: '', options: '' , price: '' }],
    }))
  }

  function updateVariant(idx, field, value) {
    setForm((prev) => {
      const variants = [...prev.variants]
      variants[idx] = { ...variants[idx], [field]: value }
      return { ...prev, variants }
    })
  }

  function removeVariant(idx) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Product name is required')
      return
    }
    if (!form.price && form.price !== 0) {
      toast.error('Price is required')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        stock: form.stock !== '' ? Number(form.stock) : -1,
        collectionTags: form.collectionTags
          ? form.collectionTags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        variants: form.variants
          .filter((v) => v.name.trim())
          .map((v) => ({
            name: v.name,
            options: typeof v.options === 'string'
              ? v.options.split(',').map((o) => o.trim()).filter(Boolean)
              : v.options,
            price: v.price ? Number(v.price) : undefined,
          })),
      }

      if (isEdit) {
        await api.put(`/api/admin/products/${id}`, payload)
        toast.success('Product updated')
      } else {
        await api.post('/api/admin/products', payload)
        toast.success('Product created')
      }
      navigate('/admin/products')
    } catch (err) {
      toast.error('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-charcoal font-heading">
          {isEdit ? 'Edit Product' : 'New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (HTML)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price</label>
              <input
                name="compareAtPrice"
                type="number"
                step="0.01"
                min="0"
                value={form.compareAtPrice}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity <span className="text-gray-400 font-normal">(-1 for unlimited)</span>
              </label>
              <input
                name="stock"
                type="number"
                min="-1"
                value={form.stock}
                onChange={handleChange}
                placeholder="-1"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection Tags</label>
              <input
                name="collectionTags"
                value={form.collectionTags}
                onChange={handleChange}
                placeholder="tag1, tag2, tag3"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isDigital"
                checked={form.isDigital}
                onChange={handleChange}
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span className="text-sm text-gray-700">Digital Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-gold focus:ring-gold"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>

          {form.isDigital && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Digital File URL</label>
              <input
                name="digitalFileUrl"
                value={form.digitalFileUrl}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
          )}
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Images</h2>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragOver
                ? 'border-gold bg-gold/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-gold" size={24} />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="text-gray-400" size={28} />
                <p className="text-sm text-gray-500">
                  Drag and drop images here, or{' '}
                  <label className="text-gold hover:text-gold-dark cursor-pointer font-medium">
                    browse
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </p>
              </div>
            )}
          </div>

          {form.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.images.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt=""
                    className="w-full aspect-square object-cover rounded-lg bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-white/90 rounded-full text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X size={14} />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 text-xs bg-charcoal/80 text-white px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-dark font-medium"
            >
              <Plus size={16} />
              Add Variant
            </button>
          </div>

          {form.variants.length === 0 ? (
            <p className="text-sm text-gray-400">No variants added. Products will use the base price.</p>
          ) : (
            <div className="space-y-3">
              {form.variants.map((variant, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Name (e.g. Size)</label>
                      <input
                        value={variant.name}
                        onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                        placeholder="Size"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Options (comma-separated)</label>
                      <input
                        value={variant.options}
                        onChange={(e) => updateVariant(idx, 'options', e.target.value)}
                        className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                        placeholder="8x10, 12x16, 18x24"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price Override</label>
                      <input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                        className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="mt-5 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">SEO</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm text-white bg-gold hover:bg-gold-dark rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="animate-spin" size={16} />}
            {isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
