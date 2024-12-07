'use client';
import { cn } from '@/lib/utils';
import { Compass, House, Landmark, MessageCircle, Plus, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export const AppLayout = ({ children }: any) => {
  const [active, setActive] = useState(0);

  const BOTTOM_NAV = [{ icon: <House size={24} strokeWidth={1.5} />, path: '/', label: 'Home' },
  { icon: <Compass size={24} strokeWidth={1.5} />, path: '/search', label: 'Search' },
  { icon: <MessageCircle size={24} strokeWidth={1.5} />, path: '/chat', label: 'Chat', },
  { icon: <Sparkles size={24} strokeWidth={1.5} />, path: '/ai', label: 'ai' },


  { icon: <User size={24} strokeWidth={1.5} />, path: '/profile', label: 'Profile' },


  ]

  const router = useRouter()
  const path = usePathname()
  const { address } = useAccount()

  useEffect(() => {
    if (!address && path !== '/login') {
      router.push('/');
    }
  }, [address, path, router]);

  if (!address && path !== '/login') {
    return <div className="p-2">Loading....</div>;
  }

  return (<main className="h-screen  overflow-y-scroll flex flex-col items-center justify-center">




    <div className="max-w-[600px] w-[100vw] flex flex-col h-full ">
      <div className="flex-grow pb-[64px]">{children}</div>
      {/* Footer */}
      <div className="w-full absolute bottom-0 left-0 bg-[#1E1E1E] items-center justify-around rounded-t-2xl flex flex-row gap-2 px-3 py-2">
        {BOTTOM_NAV.map((nav, index) => {
          // if (nav.path === '/create') {
          //   return (<div onClick={() => setActive(index)} className='rounded-full bg-black bg-[#AB9EF3] p-3 flex items-center justify-center'>{nav.icon}</div>)
          // }
          return (<Link href={nav.path} ><div onClick={() => setActive(index)} className={cn(' cursor-pointer rounded-full  p-3 flex items-center justify-center ', active === index ? "text-[#AB9EF3]  " : "")}>{nav.icon}</div></Link>)
        })}

      </div></div>


  </main>)
}