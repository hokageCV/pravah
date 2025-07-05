import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import type { Group } from '../../types';
import { useAuthStore } from '../auth/auth.store';
import { GroupForm } from './group-form';
import { useGroupStore } from './group.store';
import { createGroup } from './groups.api';

let initialGroupValue: Partial<Group> = { name: '' };

export function CreateGroup() {
  let queryClient = useQueryClient();
  let navigate = useNavigate();
  let addGroup = useGroupStore((state) => state.addGroup);
  let removeGroup = useGroupStore((state) => state.removeGroup);
  let userId = useAuthStore((state) => state.user?.id);

  let { mutate, status, error } = useMutation({
    mutationFn: createGroup,
    onMutate: async (newGroup) => {
      await queryClient.cancelQueries({ queryKey: ['groups'] });

      let optimisticGroup: Group = {
        ...newGroup,
        id: Date.now(), // Temporary negative ID
        name: '',
        ownerId: userId!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addGroup(optimisticGroup);

      return { optimisticGroup };
    },
    onSuccess: (actualGroup, _, context) => {
      // Replace optimistic group with actual data
      removeGroup(context?.optimisticGroup.id!);
      addGroup(actualGroup);
    },
    onError: (_, __, context) => {
      // Rollback on error
      removeGroup(context?.optimisticGroup.id!);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      navigate({ to: '/groups' });
    },
  });

  let handleSubmit = (data: Partial<Group>) => {
    if (!userId) return;
    mutate({ ...data, ownerId: userId } as Parameters<typeof createGroup>[0]);
  };

  return (
    <>
      <GroupForm initialValue={initialGroupValue} onSubmit={handleSubmit} />

      {status === 'pending' && <p>Creating group...</p>}
      {status === 'error' && <p>Error: {(error as Error).message}</p>}
      {status === 'success' && <p>Group created!</p>}
    </>
  );
}
