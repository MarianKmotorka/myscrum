import { Input, InputProps } from '@chakra-ui/input'
import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { Validator } from './types'

interface IFormInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  name: string
  label?: string
  type?: string
  placeholder?: string
  validate?: Validator<any>
}

const FormInput = ({
  name,
  isDisabled,
  label,
  isRequired,
  type,
  validate: initialValidate,
  ...rest
}: IFormInputProps) => {
  const form = useFormContext()
  const { errors } = form

  const validate = initialValidate ? (value: string) => initialValidate(value, form) : undefined

  const getParsingOnChangeFunction =
    (onChange: (x: any) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (type === 'number') return onChange(value || value === '0' ? Number(value) : value)
      return onChange(value)
    }

  const handleBlur = (value: any, onChange: any, onBlur: any) => {
    if (type === 'number') {
      onChange(Number(value))
    }
    onBlur()
  }

  const errorMessage = errors[name]?.message

  return (
    <Controller
      name={name}
      rules={{ validate }}
      render={({ onChange, value, onBlur, ...innerRest }) => (
        <FormControl isRequired={isRequired}>
          <FormLabel mb={1}>{label}</FormLabel>

          <Input
            {...innerRest}
            {...rest}
            value={value ?? ''}
            isInvalid={!!errorMessage}
            type={type}
            onBlur={() => handleBlur(value, onChange, onBlur)}
            onChange={getParsingOnChangeFunction(onChange)}
            isDisabled={isDisabled || form.formState.isSubmitting}
          />

          {errorMessage && (
            <FormHelperText mt={0} color='red'>
              {errorMessage}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}

export default FormInput
