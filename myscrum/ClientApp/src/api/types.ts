interface IApiErrorDetail {
  code: string
  customState: any
  propertyName: string
}

export interface IApiError {
  data: {
    errorCode: string
    errorMessage: string
    errorDetails: IApiErrorDetail[]
  }
  status: number
}
