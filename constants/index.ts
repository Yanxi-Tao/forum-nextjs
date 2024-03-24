import { Label } from '@radix-ui/react-label'
import {
  Radar,
  Bell,
  CircleUser,
  Users,
  Plus,
  LayoutDashboard,
} from 'lucide-react'

export const sidebarNavs = [
  { icon: Radar, route: '/', label: 'Explore' },
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
    icon: Plus,
    route: '/create',
    label: 'Create',
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

export const userProfileNavs = [
  { label: 'Activities', value: 'activities' },
  { label: 'Questions', value: 'questions' },
  { label: 'Answers', value: 'answers' },
  { label: 'Articles', value: 'articles' },
  { label: 'Bookmarks', value: 'bookmarks' },
  { label: 'Follows', value: 'follows' },
  { label: 'Communities', value: 'communities' },
]
