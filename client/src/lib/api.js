import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_URL || ''

async function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
  } catch {
    // No auth available
  }
  return headers
}

async function request(method, path, body) {
  const headers = await getAuthHeaders()
  const options = { method, headers }
  if (body) {
    if (body instanceof FormData) {
      delete headers['Content-Type']
      options.body = body
    } else {
      options.body = JSON.stringify(body)
    }
  }
  const res = await fetch(`${BASE_URL}${path}`, options)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || error.message || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
}
