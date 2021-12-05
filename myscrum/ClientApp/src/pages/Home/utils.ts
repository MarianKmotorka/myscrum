import { css } from '@emotion/react'

export const projectCardProps = {
  cursor: 'pointer',
  borderRadius: '2xl',
  border: 'solid 1px',
  borderColor: 'gray.200',
  bg: 'white',
  padding: '15px',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  _hover: { boxShadow: '0 0 30px rgba(0,0,0,0.15)' },
  transition: '0.2s',
  position: 'relative' as const
}

export const selectedCardOverrideProps = {
  color: 'bg',
  border: 'none',
  borderColor: '#000033',
  fontWeight: 500,
  boxShadow: '0 10px 20px rgba(5,0,40,0.17)',
  bg: 'linear-gradient(45deg,#181D31, #678983)',
  _hover: {},
  css: css`
    svg {
      color: var(--chakra-colors-bg2);
    }
  `
}
