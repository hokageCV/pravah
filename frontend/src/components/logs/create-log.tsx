import { useState } from 'react';
import type { Habit } from '../../types';
import { LogModal } from './log-modal';

type LogsSectionProps = {
  habit: Habit;
  showDate?: boolean;
};

export function CreateLog({ habit, showDate = false }: LogsSectionProps) {
  let [showModal, setShowModal] = useState(false);

  let handleClose = () => setShowModal(false);

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className='bg-c-accent-subtle text-white px-4 py-2 rounded-md hover:bg-c-accent-hover cursor-pointer'
      >
        Add Progress
      </button>

      {showModal && (
        <LogModal habit={habit} onClose={handleClose} showDate={showDate} />
      )}
    </div>
  );
}
