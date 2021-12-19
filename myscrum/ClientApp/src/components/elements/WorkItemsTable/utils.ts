import { MutableRefObject } from 'react'
import { DropTargetMonitor } from 'react-dnd'

export const shouldDropAbove = (
  monitor: DropTargetMonitor<any, any>,
  rowRef: MutableRefObject<HTMLTableRowElement>
) => {
  const clientOffset = monitor.getClientOffset()
  if (!rowRef.current || !clientOffset) return

  const hoverBoundingRect = rowRef.current.getBoundingClientRect()

  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
  const hoverClientY = clientOffset.y - hoverBoundingRect.top

  const dropAbove = hoverClientY < hoverMiddleY
  return dropAbove
}
