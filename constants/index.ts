import {
  Home,
  Bell,
  Bookmark,
  Users,
  CircleUser,
  LayoutDashboard,
} from 'lucide-react'

export const sidebarNavs = [
  { icon: Home, route: '/', label: 'Home' },
  {
    icon: Bell,
    route: '/notifications',
    label: 'Notifications',
  },
  {
    icon: LayoutDashboard,
    route: '/categories',
    label: 'Categories',
  },
  {
    icon: Bookmark,
    route: '/bookmarks',
    label: 'Bookmarks',
  },
  {
    icon: Users,
    route: '/communities',
    label: 'Communities',
  },
  {
    icon: CircleUser,
    route: '/profile',
    label: 'Profile',
  },
]
