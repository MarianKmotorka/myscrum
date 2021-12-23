import { WorkItemState } from 'domainTypes'

export interface WorkItemDetailFormValues {
  title: string
  state: WorkItemState
  sprintId: string | undefined
  assignedToId: string | undefined
  description: string | undefined
  remainingHours: number | undefined
  startDate: string | undefined
  finishDate: string | undefined
  implementationDetails: string | undefined
  acceptationCriteria: string | undefined
}
