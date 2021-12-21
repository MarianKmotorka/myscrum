import { ApiError } from 'api/types'
import { WorkItemState, WorkItemType } from 'domainTypes'
import bugPng from '../img/bug.png'
import epicPng from '../img/epic.png'
import featurePng from '../img/feature.png'
import taskPng from '../img/task.png'
import testCasePng from '../img/test-case.png'
import pbiPng from '../img/pbi.png'

export const getAvatarUrl = (userId: string) =>
  `https://avatars.dicebear.com/api/bottts/${userId}.svg?background=%23ffffff`

export const getApiErrorMessage = (err: ApiError) => {
  if (err.data.errorCode === 'ValidationError')
    return err.data.errorDetails[0]?.message || 'Something went wrong :('
  return err.data.errorMessage
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

export const workItemStateToTextColorMap = {
  [WorkItemState.New]: { text: 'New', color: '#b2b2b2' },
  [WorkItemState.Approved]: { text: 'Approved', color: '#b2b2b2' },
  [WorkItemState.InProgress]: { text: 'In progress', color: '#007acc' },
  [WorkItemState.ReadyForTest]: { text: 'Ready for test', color: '#5688e0' },
  [WorkItemState.Done]: { text: 'Done', color: '#339933' }
}

export const allowedChildWorkItemsMap = {
  [WorkItemType.Bug]: [WorkItemType.Task, WorkItemType.TestCase],
  [WorkItemType.Epic]: [WorkItemType.Feature],
  [WorkItemType.Feature]: [WorkItemType.Bug, WorkItemType.Pbi, WorkItemType.TestCase],
  [WorkItemType.Task]: [],
  [WorkItemType.TestCase]: [],
  [WorkItemType.Pbi]: [WorkItemType.Task, WorkItemType.Bug, WorkItemType.TestCase]
}
