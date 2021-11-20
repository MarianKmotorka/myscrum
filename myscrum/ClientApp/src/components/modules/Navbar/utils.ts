export interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}

export const LOGGED_OUT_NAV_ITEMS: NavItem[] = [
  {
    label: 'Developer Contact',
    children: [
      {
        label: 'LinkedIn',
        subLabel: 'My professional profile',
        href: 'https://www.linkedin.com/in/marian-kmotorka-191b48189/'
      },
      {
        label: 'Github',
        subLabel: 'My projects portfolio',
        href: 'https://github.com/MarianKmotorka'
      }
    ]
  }
]

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Inspiration',
    children: [
      {
        label: 'Explore Design Work',
        subLabel: 'Trending Design to inspire you',
        href: '#'
      },
      {
        label: 'New & Noteworthy',
        subLabel: 'Up-and-coming Designers',
        href: '#'
      }
    ]
  },
  {
    label: 'Find Work',
    children: [
      {
        label: 'Job Board',
        subLabel: 'Find your dream design job',
        href: '#'
      },
      {
        label: 'Freelance Projects',
        subLabel: 'An exclusive list for contract work',
        href: '#'
      }
    ]
  },
  {
    label: 'Learn Design',
    href: '#'
  },
  {
    label: 'Hire Designers',
    href: '#'
  }
]
