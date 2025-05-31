import { useState } from 'react'
import type { Group } from '../../types'
import { AddSvg } from '../svgs/add'
import { AddMembersModal } from './add-members-modal'

type AddMembersProp = {
  group: Group
}

export function AddMembers({ group }: AddMembersProp) {
  let [showModal, setShowModal] = useState(false)
  let handleClose = () => setShowModal(false)

  return (
    <div>
      <button onClick={() => setShowModal(true)} className='px-4 py-2 rounded-md cursor-pointer'>
        <AddSvg className='w-4 h-4' />
      </button>

      {showModal && <AddMembersModal group={group} close={handleClose} />}
    </div>
  )
}
