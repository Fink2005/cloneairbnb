'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { handleErrorApi } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useSignoutMutation } from '@/queries/useAuth'
import { useUserProfile } from '@/queries/useUser'
import { useEffect, useState } from 'react'


const account = {
  name: 'Nguyễn Văn A',
  avatar: 'https://i.pravatar.cc/150'
}

export default function DropdownAvatar() {
  const signOutMutation = useSignoutMutation();
  const router = useRouter();

  const [userId, setUserId] = useState<number>(0);
  const [handleFetch, setHandleFetch] = useState(false);
  const { data } = useUserProfile(userId, handleFetch);
  const account = data?.content

  useEffect(() => {
    const userString = localStorage.getItem('user') ? localStorage.getItem('user') : localStorage.getItem('userProfile');
    if (userString) {
      const user = JSON.parse(userString); // Chuyển chuỗi JSON thành đối tượng
      const id = user?.id;
      setUserId(id); // Lưu id vào state hoặc làm việc với id
      setHandleFetch(true)
    }
  }, []);

  useEffect(() => {
    // localStorage.removeItem('user');
    localStorage.setItem('userProfile', JSON.stringify(account));
  }, [account]);

  const signout = async () => {
    if (signOutMutation.isPending) return;
    try {
      await signOutMutation.mutateAsync();
      localStorage.removeItem("user");
      router.push('/');
    } catch (error: any) {
      handleErrorApi({ error })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
          <Avatar>
            <AvatarImage src={account?.avatar || undefined} alt={account?.name} />
            <AvatarFallback>{account?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/manage/setting'} className='cursor-pointer'>
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}




