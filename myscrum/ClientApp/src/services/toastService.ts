import { ApiError } from 'api/types'
import toast, { ToastOptions } from 'react-hot-toast'
import { getApiErrorMessage } from 'utils'

export const toastOptions: ToastOptions = {
  position: 'bottom-left',
  duration: 4000
}

export const successToast = (message: string) => toast.success(message)

export const errorToast = (message: string) => toast.error(message)

export const errorToastIfNotValidationError = (err: ApiError['data']) => {
  err.errorCode !== 'ValidationError' && errorToast(err.errorMessage)
}

export const apiErrorToast = (err: ApiError) => errorToast(getApiErrorMessage(err))
