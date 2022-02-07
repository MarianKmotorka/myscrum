import { useLayoutEffect, useRef } from 'react'

const useReactiveRef = <T>(object: T) => {
  const ref = useRef<T>(object)

  useLayoutEffect(() => {
    ref.current = object
  }, [object])

  return ref
}

export default useReactiveRef
