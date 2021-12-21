import { FormControl, FormHelperText, FormLabel, Select, SelectProps } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { Validator } from './types'

interface FormSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  name: string
  label?: string
  placeholder?: string
  validate?: Validator<any>
}

const FormSelect = ({
  name,
  label,
  placeholder,
  validate: initialValidate,
  isDisabled,
  isRequired,
  ...rest
}: FormSelectProps) => {
  const form = useFormContext()
  const { errors } = form

  const validate = initialValidate ? (value: string) => initialValidate(value, form) : undefined

  const errorMessage = errors[name]?.message

  return (
    <Controller
      name={name}
      rules={{ validate }}
      render={({ onChange, ...innerRest }) => (
        <FormControl isRequired={isRequired}>
          <FormLabel mb={1}>{label}</FormLabel>

          <Select
            {...innerRest}
            {...rest}
            onChange={onChange}
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

export default FormSelect
