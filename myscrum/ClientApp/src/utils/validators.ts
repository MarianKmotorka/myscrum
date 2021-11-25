import { Validator } from 'components/elements/HookForm/types'
import { UseFormMethods } from 'react-hook-form'

export const combineValidators =
  (validators: Validator[]) => (value: any, form: UseFormMethods<Record<string, any>>) => {
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i]
      const result = validator?.(value, form)
      if (result) return result
    }
  }

export const requiredValidator: Validator = (value, t) => (value ? undefined : 'Required')

export const minLengthValidator =
  (minLength: number): Validator =>
  (value: string, t) => {
    if (value) return value.length < minLength ? `Min length: ${minLength}` : undefined
  }

export const maxLengthValidator =
  (maxLength: number): Validator =>
  (value: string, t) => {
    if (value) return value.length > maxLength ? `Max length: ${maxLength}` : undefined
  }

export const minNumericValue =
  (min: number): Validator =>
  (value: number, t) => {
    if (value) return value < min ? `Min: ${min}` : undefined
  }

export const maxNumericValue =
  (max: number): Validator =>
  (value: number, t) => {
    if (value) return value > max ? `Max: ${max}` : undefined
  }
