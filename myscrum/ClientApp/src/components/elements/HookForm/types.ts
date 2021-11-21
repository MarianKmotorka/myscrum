import { UseFormMethods } from 'react-hook-form'

export type Validator<TFormValues = any, TValue = any> = (
  value: TValue,
  form: UseFormMethods<TFormValues>
) => string | undefined

export type SubmitFormatter<T> = (values: T, form: UseFormMethods<T>) => Record<string, any>
