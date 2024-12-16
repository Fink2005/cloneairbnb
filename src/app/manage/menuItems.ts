import { Home, LineChart, Users2, LayoutList, NotebookPen,MapPinned } from 'lucide-react'

const menuItems = [
  {
    title: 'Trang chủ',
    Icon: Home,
    href: '/'
  },
  {
    title: 'Phân tích',
    Icon: LineChart,
    href: '/manage/dashboard'
  },
  {
    title: 'Booking',
    Icon: NotebookPen,
    href: '/manage/booking'
  },
  {
    title: 'Phòng',
    Icon: LayoutList,
    href: '/manage/room'
  },
  {
    title: 'Vị trí',
    Icon: MapPinned,
    href: '/manage/location'
  },
  {
    title: 'Người dùng',
    Icon: Users2,
    href: '/manage/accounts'
  }
]

export default menuItems
