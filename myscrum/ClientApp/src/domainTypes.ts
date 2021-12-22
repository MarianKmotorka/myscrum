export interface CurrentUser {
  id: string
  email: string
  givenName: string
  surname: string
  lastLogin: string
  role: SystemRole
  projectInvitationCount: number
}

export enum SystemRole {
  User = 0,
  Admin = 1
}

export interface User {
  id: string
  fullName: string
}

export interface Project {
  id: string
  name: string
  createdAtUtc: string
  amIOwner: boolean
  owner: User
  contributors: User[]
}

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  goal: string
  isCurrentSprint: boolean
}

export interface SprintDetail {
  id: string
  name: string
  startDate: string
  endDate: string
  goal: string
}

export interface WorkItem {
  id: string
  title: string
  assignedTo?: User
  sprintId?: string
  sprintName?: string
  projectId: string
  children: WorkItem[]
  type: WorkItemType
  priority: number
  description?: string
  state: WorkItemState
  remainingHours?: number
  startDate?: string
  finishDate?: string
  parentId?: string
  implementationDetails?: string
  acceptationCriteria?: string
}

export enum WorkItemState {
  New = 0,
  Approved = 1,
  InProgress = 2,
  ReadyForTest = 3,
  Done = 4
}

export enum WorkItemType {
  Task = 0,
  Bug = 1,
  Pbi = 2,
  Feature = 3,
  Epic = 4,
  TestCase = 5
}
