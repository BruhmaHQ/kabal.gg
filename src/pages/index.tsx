import Image from "next/image";
import localFont from "next/font/local";
import { section } from "framer-motion/client";
import { cn } from "@/lib/utils";
import Tabs from "@/components/atoms/Tabs";
import { useState } from "react";
import { TrendingCard } from "@/components/molecules/TrendingCard";
import { BottomSheet, BottomSheetState } from "@/components/atoms/BottomSheet";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [active, setActive] = useState('all')
  const [trendingTab, setTrendingTab] = useState<BottomSheetState>('closed');
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} overflow-hidden dark items-center  py-3  px-2  font-[family-name:var(--font-geist-sans)]`}
    >

      <div className="flex flex-row  justify-between">

        <div className="flex flex-row gap-1 items.center"> <img src="./assets/logo-black.jpg" className="h-[32px]" height={18} alt="home" /></div>
        <div className="">

          <BottomSheet
            trigger={<div className="flex flex-row cursor-pointer  gap-1 items-center text-xs font-semibold text-white/60">
              <img src="./assets/gift.png" height={18} className="h-[24px]" alt="lootbox" /> Rewards </div>
            }
            // state={trendingTab}
            // setState={(state) => setTrendingTab(state)}
            minimalContent={<div></div>}
            expandedContent={<p>Expanded Content</p>}

          /></div></div>


 <div className="flex w-full py-1 mt-3 h-fit  flex-row overflow-scroll scroll-hide  gap-2">
<TrendingCard icon={'⚡️'} title="Trending" section={[{ title: 'Cross-chain comms', isPositive: true, percentage: 12.8 }, { title: 'Base Memes', isPositive: true, percentage: 12.8 }, { title: 'Seuioa Portfolio', isPositive: true, percentage: 12.8 },]} />
<TrendingCard icon="🚀" title="Top Gainers" section={[{ title: 'Christmas themmed', isPositive: true, percentage: 12.8 }, { title: 'Yield optimizer', isPositive: true, percentage: 12.8 }, { title: 'Name service', isPositive: true, percentage: 12.8 },]} />
<TrendingCard icon="🚨" title="Top Lossers" section={[{ title: 'Ecommerce', isPositive: false, percentage: 12.8 }, { title: 'Country Memes', isPositive: false, percentage: 12.8 }, { title: 'Clanker Ecosystem', isPositive: false, percentage: 12.8 },]} />
</div>

      <div className="my-1">
        <div className=" flex flex-row gap-2 items-center  p-3">
          <img src="./assets/trending.png" className='h-[42px]' alt="" />
          <h1 className="font-semibold ">Trending Cases</h1>
        </div>
        <Tabs activeTab={active} setActiveTab={setActive} layoutid="home-tabs"
          tabs={[
            { key: 'all', label: 'All' },
            { key: 'index', label: 'Index' },
            { key: 'kabal', label: 'Kabals' },
            { key: 'kol', label: 'KOL Managed' },
            { key: 'ai', label: 'AI Managed' },
          ]} />
      </div>


<div className="grid grid-cols-3">

<div className=""></div>

      
      </div>

      {/* <div className="flex gap-4 items-center flex-col sm:flex-row">
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="dark:invert"
            src="/vercel.svg"
            alt="Vercel logomark"
            width={20}
            height={20}
          />
          Deploy now
        </a>
        <a
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read our docs
        </a>
      </div> */}

      <div className="bg-[#262628] p-2 border">
        <h1 className="font-semibold">BTC-USD</h1>
        <div className="flex flex-row"></div>
      </div>
    </div>
  );
}




// <div className="flex w-full py-1 h-fit  flex-row overflow-scroll scroll-hide  gap-2">
// <TrendingCard icon={'⚡️'} title="Trending" section={[{ title: 'Cross-chain comms', isPositive: true, percentage: 12.8 }, { title: 'Base Memes', isPositive: true, percentage: 12.8 }, { title: 'Seuioa Portfolio', isPositive: true, percentage: 12.8 },]} />
// <TrendingCard icon="🚀" title="Top Gainers" section={[{ title: 'Christmas themmed', isPositive: true, percentage: 12.8 }, { title: 'Yield optimizer', isPositive: true, percentage: 12.8 }, { title: 'Name service', isPositive: true, percentage: 12.8 },]} />
// <TrendingCard icon="🚨" title="Top Lossers" section={[{ title: 'Ecommerce', isPositive: false, percentage: 12.8 }, { title: 'Country Memes', isPositive: false, percentage: 12.8 }, { title: 'Clanker Ecosystem', isPositive: false, percentage: 12.8 },]} />
// </div>

