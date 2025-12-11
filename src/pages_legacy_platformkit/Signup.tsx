import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@src/lib/supabase'
import { useAuth } from '@src/contexts/AuthContext'

interface InviteData {
  email: string
  merchantId: string
}

export function Signup() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteValid, setInviteValid] = useState(false)
  const [clientName, setClientName] = useState('')
  const [inviteData, setInviteData] = useState<InviteData | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing invite token')
      setValidating(false)
      return
    }

    supabase.functions.invoke('validate-invite', {
      body: { token }
    }).then(({ data, error }) => {
      if (error || !data?.valid) {
        setError(data?.error || 'Invalid invite')
        setInviteValid(false)
      } else {
        setInviteValid(true)
        setEmail(data.email)
        setClientName('Seller Centry Dashboard')
        setInviteData(data)
      }
      setValidating(false)
    })
  }, [token])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (!signUpData.user) {
        throw new Error('User creation failed')
      }

      if (inviteData?.merchantId) {
        const { error: tenantError } = await supabase
          .from('user_tenants')
          .insert({
            user_id: signUpData.user.id,
            merchant_id: inviteData.merchantId,
          })

        if (tenantError) {
        }
      }

      const { error: updateError } = await supabase
        .from('invites')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('token', token)

      if (updateError) {
      }

      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-white text-lg">Validating invite...</div>
      </div>
    )
  }

  if (!inviteValid) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-white mb-2">Invalid Invitation</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-gray-400 text-sm">Join {clientName}</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
