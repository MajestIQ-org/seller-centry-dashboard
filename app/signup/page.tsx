import { Suspense } from 'react'
import SignupClient from './SignupClient'

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="text-white text-lg">Loading...</div>
        </div>
      }
    >
      <SignupClient />
    </Suspense>
  )
}
