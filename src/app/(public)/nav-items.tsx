'use client'

import { Role } from '@/constants/type';
import { RoleType } from '@/types/jwt.types';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { handleErrorApi } from '@/lib/utils';
import { useSignoutMutation } from '@/queries/useAuth';
import { useRouter } from 'next/navigation';
import {useAppStore} from '@/components/app-provider';

const menuItems: {
  title: string,
  href: string,
  role?: RoleType[],
  hideWhenSignIn?: boolean
}[] = [
    {
      title: 'Trang chủ',
      href: '/',

    },
    {
      title: 'Đăng nhập',
      href: '/signin',
      hideWhenSignIn: true
    },
    {
      title: 'Admin',
      href: `/manage/dashboard`,
      role: [Role.Admin]
    },
    {
      title: 'User',
      href: `/user/dashboard`,
      role: [Role.User]
    }
  ]

export default function NavItems({ className }: { className?: string }) {

  // const [role, setRole] = useState<RoleType | null>(null);
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  useEffect(() => {
    const local = localStorage.getItem('userProfile');
    if (local) {
      try {
        const parsed = JSON.parse(local); // Parse JSON string
        setRole(parsed.role as RoleType); // Extract the role
      } catch (error) {
        console.error('Failed to parse userProfile from localStorage:', error);
      }
    }
  }, []);

  const signOutMutation = useSignoutMutation();
  const router = useRouter();
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
    <>
      {menuItems.map((item) => {

        const isAuth = item.role && role && item.role.includes(role)

        const canShow = (item.role === undefined && !item.hideWhenSignIn) || (!role && item.hideWhenSignIn)
        // if (item.authRequired === false && isAuth || item.authRequired === true && !isAuth) return null;

        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }
        return null
      })}
      {role && <div className={className}>
        <button onClick={signout}>Đăng xuất</button>
      </div>}

    </>
  )

}
