import { useState, type FormEvent } from 'react'
import { supabase } from '@src/lib/supabase'
import { useAuth } from '@src/contexts/AuthContext'
import { useTenant } from '@src/contexts/TenantContext'

interface SubmitTicketProps {
  onClose: () => void
}

export function SubmitTicket({ onClose }: SubmitTicketProps) {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [relatedAsin, setRelatedAsin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: submitError } = await supabase.functions.invoke('submit-ticket', {
        body: {
          email: user?.email,
          subject,
          message,
          relatedAsin: relatedAsin || undefined,
          clientName: tenant?.storeName
        }
      })

      if (submitError) throw submitError

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit ticket')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-white mb-2">Ticket Submitted</h3>
            <p className="text-gray-400">We&apos;ll get back to you soon!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Submit Support Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
            >
              <option value="">Select a subject...</option>
              <option value="Question">Question</option>
              <option value="Document Request">Document Request</option>
              <option value="Status Update">Status Update</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="relatedAsin" className="block text-sm font-medium text-gray-300 mb-2">
              Related ASIN <span className="text-gray-500">(optional)</span>
            </label>
            <input
              id="relatedAsin"
              type="text"
              value={relatedAsin}
              onChange={(e) => setRelatedAsin(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px]"
              placeholder="B07EXAMPLE"
              maxLength={10}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe your issue in detail..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
