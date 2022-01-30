import { WorkItemType } from 'domainTypes'

export const shouldShowRemainingHours = (type: WorkItemType) =>
  [WorkItemType.Feature, WorkItemType.Epic].includes(type) === false

export const canSetRemainingHours = (type: WorkItemType) =>
  [WorkItemType.Bug, WorkItemType.TestCase, WorkItemType.Task].includes(type)
