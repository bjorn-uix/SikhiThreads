import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Loader2, Check, X, Star, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
        />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    try {
      const res = await api.get('/api/admin/reviews')
      setReviews(res.reviews || res || [])
    } catch (err) {
      toast.error('Failed to load reviews: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.put(`/api/admin/reviews/${id}`, { status })
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      )
      if (selected?._id === id) {
        setSelected((prev) => ({ ...prev, status }))
      }
      toast.success(`Review ${status}`)
    } catch (err) {
      toast.error('Update failed: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-charcoal font-heading">Reviews</h1>

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
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Rating</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      No reviews yet
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-charcoal">
                        {review.product?.name || review.productName || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {review.customer?.name || review.customerName || review.name || 'Anonymous'}
                      </td>
                      <td className="py-3 px-4">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[review.status] || 'bg-gray-100 text-gray-600'
                        }`}>
                          {review.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelected(review)}
                            className="p-1.5 text-gray-400 hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          {review.status !== 'approved' && (
                            <button
                              onClick={() => updateStatus(review._id, 'approved')}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {review.status !== 'rejected' && (
                            <button
                              onClick={() => updateStatus(review._id, 'rejected')}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          )}
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

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-charcoal">Review Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal">
                    {selected.product?.name || selected.productName || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    by {selected.customer?.name || selected.customerName || selected.name || 'Anonymous'}
                  </p>
                </div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                  statusColors[selected.status] || 'bg-gray-100 text-gray-600'
                }`}>
                  {selected.status || 'pending'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <StarRating rating={selected.rating} />
                <span className="text-sm text-gray-500">{selected.rating}/5</span>
              </div>

              {selected.title && (
                <p className="font-medium text-charcoal">{selected.title}</p>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selected.comment || selected.text || selected.review || 'No review text'}
                </p>
              </div>

              <p className="text-xs text-gray-400">
                Submitted on {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'long', day: 'numeric',
                }) : '-'}
              </p>

              <div className="flex justify-end gap-2 pt-2">
                {selected.status !== 'approved' && (
                  <button
                    onClick={() => updateStatus(selected._id, 'approved')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                )}
                {selected.status !== 'rejected' && (
                  <button
                    onClick={() => updateStatus(selected._id, 'rejected')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
                  >
                    <X size={16} />
                    Reject
                  </button>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
