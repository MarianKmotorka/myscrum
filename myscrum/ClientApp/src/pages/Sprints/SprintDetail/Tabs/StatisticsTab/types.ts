import { User } from 'domainTypes'

export interface SprintStatistics {
  capacities: Array<{ assignedWorkHours: number; capacityHours: number; user: User }>
}
