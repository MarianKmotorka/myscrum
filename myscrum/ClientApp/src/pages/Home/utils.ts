export const projectCardProps = {
  cursor: 'pointer',
  borderRadius: '2xl',
  border: 'solid 1px',
  borderColor: 'gray.200',
  padding: '15px',
  _hover: { boxShadow: '0 0 20px rgba(0,0,0,0.1)' },
  transition: '0.2s',
  position: 'relative' as const
}

export const selectedCardOverrideProps = {
  borderColor: 'linkedin.700',
  color: 'linkedin.700',
  fontWeight: 500
}
