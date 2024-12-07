import Image from "next/image";
import localFont from "next/font/local";
import { section } from "framer-motion/client";
import { cn } from "@/lib/utils";
import Tabs from "@/components/atoms/Tabs";
import { useState } from "react";
import { TrendingCard } from "@/components/molecules/TrendingCard";
import { BottomSheet, BottomSheetState } from "@/components/atoms/BottomSheet";
import { PNLChart } from "@/components/atoms/PNLChart";

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



      <div className="space-y-2">
        {TrendingFundsData.map((fund) => (
          <TrendingFundCard
            key={fund.id}
            {...fund}
          />
        ))}
      </div>
    </div>
  );
}




// <div className="flex w-full py-1 h-fit  flex-row overflow-scroll scroll-hide  gap-2">
// <TrendingCard icon={'⚡️'} title="Trending" section={[{ title: 'Cross-chain comms', isPositive: true, percentage: 12.8 }, { title: 'Base Memes', isPositive: true, percentage: 12.8 }, { title: 'Seuioa Portfolio', isPositive: true, percentage: 12.8 },]} />
// <TrendingCard icon="🚀" title="Top Gainers" section={[{ title: 'Christmas themmed', isPositive: true, percentage: 12.8 }, { title: 'Yield optimizer', isPositive: true, percentage: 12.8 }, { title: 'Name service', isPositive: true, percentage: 12.8 },]} />
// <TrendingCard icon="🚨" title="Top Lossers" section={[{ title: 'Ecommerce', isPositive: false, percentage: 12.8 }, { title: 'Country Memes', isPositive: false, percentage: 12.8 }, { title: 'Clanker Ecosystem', isPositive: false, percentage: 12.8 },]} />
// </div>

// Enum for fund categories
export enum FundCategory {
  AI_MANAGED = 'AI Managed',
  KOL_MANAGED = 'KOL Managed',
  INDEXES = 'Indexes',
  CABAL_CHATS = 'Cabal Chats',
  CRYPTO_AI = 'Crypto AI',
  TECH_INNOVATION = 'Tech Innovation'
}

// Updated interface for fund data
interface TrendingFundData {
  id: string;
  name: string;
  category: FundCategory;
  positive: boolean;
  per: number;
  mcap: string;
  performanceData: number[];
}

const TrendingFundsData: TrendingFundData[] = [
  // AI Managed Funds
  {
    id: 'anthropic-ai-fund',
    name: 'Anthropic Intelligence Fund',
    category: FundCategory.AI_MANAGED,
    positive: true,
    per: 15.3,
    mcap: '$450M',
    performanceData: [100, 110, 115, 125, 135, 145]
  },
  {
    id: 'openai-ventures-fund',
    name: 'OpenAI Ventures Fund',
    category: FundCategory.AI_MANAGED,
    positive: true,
    per: 18.7,
    mcap: '$620M',
    performanceData: [100, 112, 120, 132, 145, 160]
  },
  {
    id: 'deepmind-strategic-fund',
    name: 'DeepMind Strategic Investments',
    category: FundCategory.AI_MANAGED,
    positive: true,
    per: 12.5,
    mcap: '$380M',
    performanceData: [100, 108, 112, 118, 125, 132]
  },

  // KOL Managed Funds
  {
    id: 'balaji-crypto-fund',
    name: 'Balaji Crypto Innovation Fund',
    category: FundCategory.KOL_MANAGED,
    positive: true,
    per: 22.1,
    mcap: '$520M',
    performanceData: [100, 115, 128, 140, 155, 170]
  },
  {
    id: 'naval-ai-thesis-fund',
    name: 'Naval AI Thesis Fund',
    category: FundCategory.KOL_MANAGED,
    positive: false,
    per: -5.6,
    mcap: '$290M',
    performanceData: [100, 95, 90, 85, 80, 75]
  },
  {
    id: 'elad-gil-tech-fund',
    name: 'Elad Gil Tech Opportunities',
    category: FundCategory.KOL_MANAGED,
    positive: true,
    per: 16.2,
    mcap: '$410M',
    performanceData: [100, 112, 118, 126, 135, 145]
  },

  // Indexes
  {
    id: 'ai-innovation-index',
    name: 'Global AI Innovation Index',
    category: FundCategory.INDEXES,
    positive: true,
    per: 10.8,
    mcap: '$750M',
    performanceData: [100, 106, 112, 118, 125, 132]
  },
  {
    id: 'tech-disruptors-index',
    name: 'Tech Disruptors Composite Index',
    category: FundCategory.INDEXES,
    positive: false,
    per: -3.2,
    mcap: '$680M',
    performanceData: [100, 97, 94, 90, 86, 82]
  },
  {
    id: 'ai-chip-index',
    name: 'AI Semiconductor Index',
    category: FundCategory.INDEXES,
    positive: true,
    per: 25.6,
    mcap: '$920M',
    performanceData: [100, 120, 135, 150, 170, 190]
  },

  // Cabal Chats
  {
    id: 'frontier-research-cabal',
    name: 'Frontier Research Cabal',
    category: FundCategory.CABAL_CHATS,
    positive: true,
    per: 8.7,
    mcap: '$210M',
    performanceData: [100, 105, 110, 115, 120, 125]
  },
  {
    id: 'ai-strategy-collective',
    name: 'AI Strategy Collective',
    category: FundCategory.CABAL_CHATS,
    positive: false,
    per: -2.1,
    mcap: '$180M',
    performanceData: [100, 98, 95, 92, 88, 85]
  },
  {
    id: 'tech-futures-network',
    name: 'Tech Futures Network',
    category: FundCategory.CABAL_CHATS,
    positive: true,
    per: 6.5,
    mcap: '$240M',
    performanceData: [100, 103, 107, 110, 114, 118]
  },

  // Crypto AI
  {
    id: 'crypto-ai-convergence-fund',
    name: 'Crypto AI Convergence Fund',
    category: FundCategory.CRYPTO_AI,
    positive: true,
    per: 14.9,
    mcap: '$380M',
    performanceData: [100, 110, 118, 126, 135, 144]
  },
  {
    id: 'blockchain-ai-innovations',
    name: 'Blockchain AI Innovations',
    category: FundCategory.CRYPTO_AI,
    positive: false,
    per: -4.3,
    mcap: '$260M',
    performanceData: [100, 96, 92, 88, 84, 80]
  },
  {
    id: 'decentralized-intelligence-fund',
    name: 'Decentralized Intelligence Fund',
    category: FundCategory.CRYPTO_AI,
    positive: true,
    per: 11.6,
    mcap: '$310M',
    performanceData: [100, 107, 112, 118, 124, 130]
  },

  // Tech Innovation
  {
    id: 'nvidia-ai-innovation-fund',
    name: 'NVIDIA AI Innovation Fund',
    category: FundCategory.TECH_INNOVATION,
    positive: true,
    per: 30.2,
    mcap: '$1.2B',
    performanceData: [100, 125, 145, 170, 200, 230]
  },
  {
    id: 'microsoft-ai-research-fund',
    name: 'Microsoft AI Research Fund',
    category: FundCategory.TECH_INNOVATION,
    positive: true,
    per: 19.8,
    mcap: '$780M',
    performanceData: [100, 115, 130, 145, 160, 175]
  },
  {
    id: 'google-moonshot-fund',
    name: 'Google Moonshot Innovations',
    category: FundCategory.TECH_INNOVATION,
    positive: false,
    per: -2.7,
    mcap: '$650M',
    performanceData: [100, 98, 95, 93, 90, 87]
  },
  {
    id: 'meta-ai-ventures',
    name: 'Meta AI Ventures',
    category: FundCategory.TECH_INNOVATION,
    positive: true,
    per: 16.5,
    mcap: '$520M',
    performanceData: [100, 110, 120, 130, 140, 150]
  },
  {
    id: 'intel-next-gen-tech',
    name: 'Intel Next Gen Tech Fund',
    category: FundCategory.TECH_INNOVATION,
    positive: true,
    per: 12.3,
    mcap: '$440M',
    performanceData: [100, 108, 114, 120, 126, 132]
  }
];

// Updated Fund Card Component
const TrendingFundCard: React.FC<TrendingFundData> = ({
  name,
  category,
  positive,
  per,
  mcap,
  performanceData
}) => {
  const positiveData = [100, 110, 105, 120, 115, 125];
  const negativeData = [100, 90, 95, 85, 80, 75];

  return (
    <div className="flex flex-row items-center justify-between p-2 gap-1 border-[#232425] bg-[#1e1e1e] border mx-2 mb-1 rounded">
<div className="flex flex-col">
          <h1 className='text-sm font-medium'>{name}</h1>
          <div className="flex flex-col w-fit">
            <span
              className={`text-xs px-2 py-0.5 rounded ${category === FundCategory.AI_MANAGED ? 'bg-blue-800/50' :
                  category === FundCategory.KOL_MANAGED ? 'bg-green-800/50' :
                    category === FundCategory.INDEXES ? 'bg-purple-800/50' :
                      category === FundCategory.CABAL_CHATS ? 'bg-red-800/50' :
                        category === FundCategory.CRYPTO_AI ? 'bg-yellow-800/50' :
                          'bg-gray-800/50'
                } text-white`}
            >
              {category}
            </span>
          </div></div>
          <PNLChart data={positive ? positiveData : negativeData} />
          <div className="flex flex-col gap-1 text-right">
            <div className={positive ? 'text-green-400' : 'text-red-400'}>
              {per}%
            </div>
            <div className='text-xs text-gray-400'>{mcap} Avg MCap</div>
          </div>
   

    </div>
  );
};
