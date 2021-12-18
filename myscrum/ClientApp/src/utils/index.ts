import { ApiError } from 'api/types'
import { WorkItemState, WorkItemType } from 'domainTypes'

export const getAvatarUrl = (userId: string) =>
  `https://avatars.dicebear.com/api/bottts/${userId}.svg?background=%23F0E9D2`

export const getApiErrorMessage = (err: ApiError) => {
  if (err.data.errorCode === 'ValidationError')
    return err.data.errorDetails[0]?.message || 'Something went wrong :('
  return err.data.errorMessage
}

export const workItemTypeToImageMap = {
  [WorkItemType.Bug]: '/bug.png',
  [WorkItemType.Epic]: '/epic.png',
  [WorkItemType.Feature]: '/feature.png',
  [WorkItemType.Task]: '/task.png',
  [WorkItemType.TestCase]: '/test-case.png',
  [WorkItemType.Pbi]: '/pbi.png'
}

export const workItemStateToTextColorMap = {
  [WorkItemState.New]: { text: 'New', color: '#b2b2b2' },
  [WorkItemState.Approved]: { text: 'Approved', color: '#b2b2b2' },
  [WorkItemState.InProgress]: { text: 'In progress', color: '#007acc' },
  [WorkItemState.ReadyForTest]: { text: 'Ready for test', color: '#5688e0' },
  [WorkItemState.Done]: { text: 'Done', color: '#339933' }
}
