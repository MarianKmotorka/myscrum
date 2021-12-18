import { ApiError } from 'api/types'
import { WorkItemType } from 'domainTypes'

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
