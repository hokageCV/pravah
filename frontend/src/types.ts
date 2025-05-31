export type User = {
  id: number
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export type Habit = {
  id: number
  userId: number
  name: string
  isActive: boolean
  description?: string
  createdAt: string
  updatedAt: string
}

export type GoalLevel = 'A' | 'B' | 'C'

export type Goal = {
  id: number
  habitId: number
  level: GoalLevel
  targetValue: number
  unit: string
  description?: string
  createdAt: string
  updatedAt: string
}

export type Log = {
  id: number
  habitId: number
  date: number
  goalLevel?: string
  actualValue: number
  createdAt: string
  updatedAt: string
}

export type Group = {
  id: number
  name: string
  ownerId: number
  createdAt: string
  updatedAt: string
}

export type Membership = {
  id: number
  groupId: number
  userdId: number
  createdAt: string
  updatedAt: string
}
