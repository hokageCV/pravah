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

export type NewGoal = {
  habitId: number
  level: GoalLevel
  targetValue: number
  unit: string
  description?: string
}

export type HabitProgress = {
  id: number
  habitId: number
  date: number
  goalLevel?: string
  actualValue: number
  createdAt: string
  updatedAt: string
}
