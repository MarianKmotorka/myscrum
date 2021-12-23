import { WorkItemState } from 'domainTypes'

export interface WorkItemDetailFormValues {
  title: string
  assignedToId: string | undefined
  state: WorkItemState
  sprintId: string | undefined
}
