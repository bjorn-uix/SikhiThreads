import { useState, useEffect } from 'react'
import { api } from '../../lib/api'
import { Loader2, Download, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscribers()
  }, [])

  async function loadSubscribers() {
    try {
      const res = await api.get('/api/admin/subscribers')
      setSubscribers(res.subscribers || res || [])
    } catch (err) {
      toast.error('Failed to load subscribers: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function exportCSV() {
    if (subscribers.length === 0) {
      toast.error('No subscribers to export')
      return
    }

    const headers = ['Email', 'Name', 'Source', 'Date Subscribed']
    const rows = subscribers.map((s) => [
      s.email || '',
      s.name || '',
      s.source || '',
      s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `subscribers_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-charcoal font-heading">Email Subscribers</h1>
          <span className="text-sm text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
            {subscribers.length}
          </span>
        </div>
        <button
          onClick={exportCSV}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-charcoal hover:bg-charcoal-light text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Download size={16} />
          Export CSV
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
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Source</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400">
                      <Mail className="mx-auto mb-2 text-gray-300" size={32} />
                      No subscribers yet
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr key={sub._id || sub.email} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-charcoal">{sub.email}</td>
                      <td className="py-3 px-4 text-gray-600">{sub.name || '-'}</td>
                      <td className="py-3 px-4 text-gray-500 capitalize">{sub.source || '-'}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
