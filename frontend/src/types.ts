export type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Habit = {
  id: number;
  userId: number;
  name: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type GoalLevel = 'A' | 'B' | 'C';

export type Goal = {
  id: number;
  habitId: number;
  level: GoalLevel;
  targetValue: number;
  unit: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Log = {
  id: number;
  habitId: number;
  date: number;
  goalLevel?: string;
  actualValue: number;
  createdAt: string;
  updatedAt: string;
};

export type Group = {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

export type Membership = {
  id: number;
  groupId: number;
  userdId: number;
  createdAt: string;
  updatedAt: string;
};

export type GroupHabit = {
  id: number;
  groupId: number;
  habitId: number;
  createdAt: string;
  updatedAt: string;
};

export type MemberHabit = {
  userId: number;
  userName: string;
  habitId: number;
  habitName: string;
  habitCreatedAt: string;
};

export type DayData = {
  day: string;
  date: string;
  weekday: number; // 0 (Sun) to 6 (Sat)
};

export type MonthData = {
  name: string;
  days: (DayData | null)[];
};

export type NotificationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'default'
  | 'unsupported';
