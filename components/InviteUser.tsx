'use client'

interface Props {
  onClose: () => void
}

export function InviteUser({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1f2e] rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Invite User</h2>
        <p className="text-gray-400 mb-4">Coming soon...</p>
        <button
          onClick={onClose}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  )
}
