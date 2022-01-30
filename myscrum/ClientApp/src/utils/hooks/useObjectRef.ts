import { useLayoutEffect, useRef } from 'react'

const useObjectRef = <T>(object: T) => {
  const callbackRef = useRef<T>(object)

  useLayoutEffect(() => {
    callbackRef.current = object
  }, [object])

  return callbackRef
}

export default useObjectRef
