import {
  Radar,
  Bell,
  CircleUser,
  Users,
  Plus,
  LayoutDashboard,
} from 'lucide-react'

export const sidebarNavs = [
  { icon: LayoutDashboard, route: '/', label: 'Explore' },
  {
    icon: Bell,
    route: '/notifications',
    label: 'Notifications',
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

export const createFeedTypes = [
  { label: 'Question', value: 'question' },
  { label: 'Article', value: 'article' },
  { label: 'Answer', value: 'answer' },
]

export const ANSWERS_FETCH_SPAN = 5
export const POST_FETCH_SPAN = 5
