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
}
