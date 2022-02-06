export interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
  isExternal?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Sprints',
    href: '/sprints',
    children: [
      {
        label: 'Current Sprint',
        subLabel: 'Work that needs to be done now.',
        href: '/sprints/current'
      }
    ]
  },
  {
    label: 'Backlog',
    href: '/backlog'
  }
]
