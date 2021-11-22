import { ApiError } from 'api/types'

export const getAvatarUrl = (userId: string) =>
  `https://avatars.dicebear.com/api/bottts/${userId}.svg?background=%23ffffff`

export const getApiErrorMessage = (err: ApiError) => {
  if (err.data.errorCode === 'ValidationError')
    return err.data.errorDetails[0]?.message || 'Something went wrong :('
  return err.data.errorMessage
}
