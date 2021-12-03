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
  color: '#fff',
  border: 'none',
  borderColor: '#000033',
  fontWeight: 500,
  boxShadow: '0 10px 20px rgba(5,0,40,0.17)',
  bg: 'linear-gradient(45deg,#500472bb, #79cbb8  )',
  _hover: {}
}
