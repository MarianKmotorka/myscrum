import { ApiError } from 'api/types'
import toast from 'react-hot-toast'

const position = 'bottom-left' as const

export const successToast = (message: string) => toast.success(message, { position })

export const errorToast = (message: string) => toast.error(message, { position })

export const errorToastIfNotValidationError = (err: ApiError['data']) => {
  err.errorCode !== 'ValidationError' && errorToast(err.errorMessage)
}
