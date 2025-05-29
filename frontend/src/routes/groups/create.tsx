import { createFileRoute } from '@tanstack/react-router'
import { CreateGroup } from '../../components/groups/create-group'

export const Route = createFileRoute('/groups/create')({
  component: CreateGroup,
})
