export interface User {
  id: string
  email: string
  givenName: string
  surname: string
  lastLogin: string
  role: SystemRole
}

export enum SystemRole {
  User = 0,
  Admin = 1
}

export interface Project {
  id: string
  name: string
  createdAtUtc: string
  amIOwner: boolean
}
