import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@src/lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          throw authError
        }

        if (data.session) {
          navigate('/', { replace: true })
        } else {
          throw new Error('No session found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed')
        
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
            <p className="text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Completing sign in...</h1>
          <p className="text-gray-400">Please wait while we authenticate you.</p>
        </div>
      </div>
    </div>
  )
}
