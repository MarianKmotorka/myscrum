import { FormControl, FormHelperText, FormLabel, Select, SelectProps } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { Validator } from './types'

interface FormSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  name: string
  label?: string
  placeholder?: string
  onChangeFormatter?: (value: string) => any
  validate?: Validator<any>
}

const FormSelect = ({
  name,
  label,
  placeholder,
  validate: initialValidate,
  isDisabled,
  isRequired,
  onChangeFormatter = x => x,
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
            onChange={x => onChange(onChangeFormatter(x.target.value))}
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
