export interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
  isExternal?: boolean
}

export const LOGGED_OUT_NAV_ITEMS: NavItem[] = [
  {
    label: 'Developer Contact',
    children: [
      {
        label: 'LinkedIn',
        subLabel: 'My professional profile',
        href: 'https://www.linkedin.com/in/marian-kmotorka-191b48189/',
        isExternal: true
      },
      {
        label: 'Github',
        subLabel: 'My projects portfolio',
        href: 'https://github.com/MarianKmotorka',
        isExternal: true
      }
    ]
  }
]

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Nested',
    children: [
      {
        label: 'Explore Design Work',
        subLabel: 'Trending Design to inspire you',
        href: '/nestedRoute'
      }
    ]
  },
  {
    label: 'Projects',
    href: '/projects'
  }
]
