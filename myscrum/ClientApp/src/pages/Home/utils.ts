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
  color: 'white',
  border: 'none',
  fontWeight: 500,
  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
  bg: 'linear-gradient(45deg, #500472, #79cbb8 ,#fff  )',
  _hover: {}
}
