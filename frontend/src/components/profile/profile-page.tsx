import { capitalize } from '../../utils/text';
import { DateTime } from 'luxon';
import { useAuthStore } from '../auth/auth.store';

export function ProfilePage() {
  let user = useAuthStore((state) => state.user);

  return (
    <>
      <div className='max-w-4xl mx-auto px-4 py-6'>
        <p className='text-lg'>
          <span className=' font-bold'>Name: </span>
          <span>{capitalize(user?.username)}</span>
        </p>
        {user?.email && (
          <p className='text-lg'>
            <span className=' font-bold'>Email: </span>
            <span>{user?.email}</span>
          </p>
        )}

        {user?.createdAt && (
          <p className='text-lg'>
            <span className=' font-bold'>Joined:</span>
            <span>
              {' '}
              {DateTime.fromISO(user.createdAt.replace(' ', 'T')).toRelative()}
            </span>
          </p>
        )}
      </div>
    </>
  );
}
