import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
    html{
        scroll-behavior: smooth;
    }

    body{
        background-color: var(--chakra-colors-bg);
    }

    .chakra-tabs__tablist button {
            box-shadow: none !important;
    }
`
