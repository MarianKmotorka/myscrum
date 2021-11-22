import { ApiError } from 'api/types'
import toast, { ToastOptions } from 'react-hot-toast'
import { getApiErrorMessage } from 'utils'

const options: ToastOptions = {
  position: 'bottom-left',
  duration: 4000
}

export const successToast = (message: string) => toast.success(message, options)

export const errorToast = (message: string) => toast.error(message, options)

export const errorToastIfNotValidationError = (err: ApiError['data']) => {
  err.errorCode !== 'ValidationError' && errorToast(err.errorMessage)
}

export const apiErrorToast = (err: ApiError) => errorToast(getApiErrorMessage(err))
