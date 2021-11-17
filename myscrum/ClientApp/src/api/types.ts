interface ApiErrorDetail {
  code: string
  customState: any
  propertyName: string
}

export interface ApiError {
  data: {
    errorCode: string
    errorMessage: string
    errorDetails: ApiErrorDetail[]
  }
  status: number
}
