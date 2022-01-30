import { ApiError } from 'api/types'
import { WorkItemState, WorkItemType } from 'domainTypes'
import bugPng from '../img/bug.png'
import epicPng from '../img/epic.png'
import featurePng from '../img/feature.png'
import taskPng from '../img/task.png'
import testCasePng from '../img/test-case.png'
import pbiPng from '../img/pbi.png'
import moment from 'moment'

export const getAvatarUrl = (userId: string) =>
  `https://avatars.dicebear.com/api/micah/${userId}.svg?background=%23ffffff`

export const getApiErrorMessage = (err: ApiError) => {
  if (err.data.errorCode === 'ValidationError')
    return err.data.errorDetails[0]?.message || 'Something went wrong :('
  return err.data.errorMessage || err.data.errorCode || 'Something went wrong :('
}

export const workItemTypeToImageMap = {
  [WorkItemType.Bug]: bugPng,
  [WorkItemType.Epic]: epicPng,
  [WorkItemType.Feature]: featurePng,
  [WorkItemType.Task]: taskPng,
  [WorkItemType.TestCase]: testCasePng,
  [WorkItemType.Pbi]: pbiPng
}

export const workItemTypeToColorMap = {
  [WorkItemType.Bug]: '#CC293D',
  [WorkItemType.Epic]: '#FF7B00',
  [WorkItemType.Feature]: '#773B93',
  [WorkItemType.Task]: '#F2CB1D',
  [WorkItemType.TestCase]: '#8E5ACA',
  [WorkItemType.Pbi]: '#009CCC'
}

export const workItemTypeToTextMap = {
  [WorkItemType.Bug]: 'Bug',
  [WorkItemType.Epic]: 'Epic',
  [WorkItemType.Feature]: 'Feature',
  [WorkItemType.Task]: 'Task',
  [WorkItemType.TestCase]: 'Test Case',
  [WorkItemType.Pbi]: 'Product Backlog Item'
}

export const workItemStateToTextColorMap = {
  [WorkItemState.New]: { text: 'New', color: '#b2b2b2' },
  [WorkItemState.Approved]: { text: 'Approved', color: '#b2b2b2' },
  [WorkItemState.InProgress]: { text: 'In progress', color: '#007acc' },
  [WorkItemState.ReadyForTest]: { text: 'Ready for test', color: '#5688e0' },
  [WorkItemState.Done]: { text: 'Done', color: '#339933' }
}

export const allowedChildWorkItemsMap: Record<WorkItemType, WorkItemType[]> = {
  [WorkItemType.Bug]: [],
  [WorkItemType.Epic]: [WorkItemType.Feature],
  [WorkItemType.Feature]: [WorkItemType.Bug, WorkItemType.Pbi, WorkItemType.TestCase],
  [WorkItemType.Task]: [],
  [WorkItemType.TestCase]: [],
  [WorkItemType.Pbi]: [WorkItemType.Task, WorkItemType.Bug, WorkItemType.TestCase]
}

export const formatDateForInput = (date: string) => moment(date).format('YYYY-MM-DD')

export const toLocalTime = (date: string | Date, format?: string) => {
  const utc = moment.utc(date).toDate()
  return moment(utc)
    .local()
    .format(format || 'DD MMMM yyyy, HH:mm')
}

export const getComputedRemainingHours = (
  children: { remainingHours?: number }[]
): number | undefined => {
  if (children.length === 0) return undefined
  if (children.every(x => !x.remainingHours && x.remainingHours !== 0)) return undefined

  return children.map(x => x.remainingHours).reduce((acc, curr) => (curr ? acc! + curr : acc), 0)
}
