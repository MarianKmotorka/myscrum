export const projectCardProps = {
  cursor: 'pointer',
  borderRadius: '2xl',
  border: 'solid 1px',
  borderColor: 'gray.200',
  bg: 'white',
  padding: '15px',
  _hover: { boxShadow: '0 10px 20px rgba(0,0,50,0.1)' },
  transition: '0.2s',
  position: 'relative' as const
}

export const selectedCardOverrideProps = {
  color: 'secondary',
  fontWeight: 500,
  boxShadow: '0 10px 20px rgba(0,0,50,0.1)',
  borderColor: 'primary',
  _hover: {}
}
