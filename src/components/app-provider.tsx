'use client'
import {decodeToken, getUserTokenFromLocalStorage, removeUserTokenFromLocalStorage} from '@/lib/utils';
import { RoleType } from '@/types/jwt.types'
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {useEffect, useRef} from 'react';
import { create } from 'zustand'



const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // refetchOnMount: false
        }
    }
})

type AppStoreType = {
    // user: SignupBodyType | null
    // setUser: (user: SignupBodyType | null) => void
    isAuth: boolean
    role: RoleType | undefined
    setRole: (role?: RoleType | undefined) => void
}

export const useAppStore = create<AppStoreType>((set) => ({
    isAuth: false,
    role: undefined as RoleType | undefined,
    setRole: (role?: RoleType | undefined) => {
        set({role, isAuth: Boolean(role)})
        if(!role){
            removeUserTokenFromLocalStorage()
        }
    },
    // user: null,
    // setUser: (user) => set({ user }),

  }))



export default function AppProvider({children}:{children: React.ReactNode}) {
    const setRole = useAppStore((state) => state.setRole)

    const count = useRef(0)

    useEffect(() => {
        if(count.current === 0){
            const userToken = getUserTokenFromLocalStorage();
            if(userToken){
                const role = decodeToken(userToken).role;
                setRole(role);
            }
            count.current++
        }
    }, [setRole]);


    return (
        <QueryClientProvider  client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}