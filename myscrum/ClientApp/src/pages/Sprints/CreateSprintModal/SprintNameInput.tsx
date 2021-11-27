import { useState, useRef, useEffect, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import moment from 'moment'

import { Checkbox } from '@chakra-ui/checkbox'
import { HStack } from '@chakra-ui/layout'
import { requiredValidator } from 'utils/validators'
import FormInput from 'components/elements/HookForm/FormInput'

const SprintNameInput = () => {
  const [isNameGenerated, setIsNameGenerated] = useState(true)
  const { setValue, watch } = useFormContext()
  const userEnteredName = useRef('')

  const name = watch('name') as string
  const startDate = watch('startDate') as string
  const endDate = watch('endDate') as string

  const generateName = useCallback(() => {
    const formatDate = (date: string) => (date ? moment(date).format('DD MMM') : 'xx')
    return `Sprint ${formatDate(startDate)} - ${formatDate(endDate)}`
  }, [startDate, endDate])

  useEffect(() => {
    if (isNameGenerated) setValue('name', generateName())
  }, [isNameGenerated, generateName, setValue])

  useEffect(() => {
    if (!isNameGenerated) setValue('name', userEnteredName.current)
  }, [isNameGenerated, setValue])

  useEffect(() => {
    if (!isNameGenerated) userEnteredName.current = name
  }, [name, isNameGenerated])

  return (
    <HStack width='100%' wrap={{ base: 'wrap', md: 'initial' }}>
      <FormInput
        flex='1'
        isRequired
        name='name'
        label='Name'
        placeholder='Sprint name'
        isDisabled={isNameGenerated}
        validate={requiredValidator}
      />

      <Checkbox
        pt={7}
        isChecked={isNameGenerated}
        onChange={e => setIsNameGenerated(e.target.checked)}
      >
        Generate
      </Checkbox>
    </HStack>
  )
}

export default SprintNameInput
