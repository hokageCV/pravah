type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0  bg-opacity-5 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.50)]'>
      <div className='bg-c-surface p-6 rounded-lg max-w-md w-full shadow-lg'>
        <h3 className='text-xl font-semibold mb-2'>{title}</h3>
        <p className='text-c-text-muted mb-4'>{message}</p>
        <div className='flex gap-3 justify-end'>
          <button
            onClick={onClose}
            className='bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 cursor-pointer'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className='bg-c-accent text-white px-4 py-2 rounded-md hover:bg-c-accent-hover cursor-pointer'
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
