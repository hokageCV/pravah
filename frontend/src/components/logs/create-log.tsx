import { useState } from 'react'
import { LogModal } from './log-modal'

type LogsSectionProps = {
  habitId: number
}

export function CreateLog({ habitId }: LogsSectionProps) {
  let [showModal, setShowModal] = useState(false)

  let handleClose = () => setShowModal(false)

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className='bg-c-accent-subtle text-white px-4 py-2 rounded-md hover:bg-c-accent-hover'
      >
        Create Log
      </button>

      {showModal && <LogModal habitId={habitId} onClose={handleClose} />}
    </div>
  )
}
