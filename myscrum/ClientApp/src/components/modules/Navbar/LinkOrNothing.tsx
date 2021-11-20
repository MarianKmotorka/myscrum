import { Link } from 'react-router-dom'

const LinkOrNothing = ({
  isNothing,
  children,
  to
}: {
  to: string
  isNothing: boolean
  children: JSX.Element
}) => {
  return isNothing ? children : <Link to={to}>{children}</Link>
}

export default LinkOrNothing
