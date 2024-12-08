import { PNLChart } from '@/components/atoms/PNLChart';
import { ArrowRight ,X} from 'lucide-react'
const AIPage = () => {

    const AIFundsData: any[] = [
        {
            id: 'grok-narratives',
            name: 'GrokAI Narratives',
            logo: './assets/grok.svg', // Placeholder path
            positive: true,
            per: 12.5,
            mcap: '$420M',
            performanceData: [100, 110, 105, 120, 115, 125]
        },
        {
            id: 'perplexity-insights',
            name: 'Perplexity Narative',
            logo: './assets/perplexity.png', // Placeholder path
            positive: true,
            per: 9.3,
            mcap: '$350M',
            performanceData: [100, 108, 112, 118, 122, 130]
        },
    ];


    const AINarratives = [{
        id: 'anthropic-transformer',
        name: 'Virtuals Tokens',
        logo: './assets/virtuals.jpeg', // Placeholder path
        positive: false,
        per: -5.2,
        mcap: '$280M',
        performanceData: [100, 95, 90, 85, 80, 75]
    },
    {
        id: 'openai-ventures',
        name: 'Clanker Tokens',
        logo: './assets/clanker.jpeg', // Placeholder path
        positive: true,
        per: 15.7,
        mcap: '$650M',
        performanceData: [100, 112, 118, 125, 135, 145]
    },

    {
        id: 'paradigm-ai-token',
        name: 'Paradigm AI Fund',
        logo: './assets/paradigm.jpeg', // Placeholder path
        positive: true,
        per: 8.7,
        mcap: '$290M',
        performanceData: [100, 106, 110, 115, 120, 125]
    },]
    const [isOpen, setIsOpen] = useState(false);
    const [currentText, setCurrentText] = useState("");
  
    const texts = [
      `  Here are the top 10 meme coins trending on X in the past 24 hours, based on the percentage gains:
  
  $BABYDOGE - +71.82%
  $TURBO - +27.94%
  $AI16Z - +27.77%
  $FWOG - +20.33%
  $MOG - +18.55%
  $ANDY - +18.26%
  $ZEREBRO - +17.22%
  $FLOKI - +14.85%
  $CAT - +14.58%
  $PEPE - Not explicitly listed in the top 9 from X posts, but known for significant 24-hour gains from other sources.`,
      `  The latest crypto narrative on X (formerly Twitter) revolves around several key themes and developments:
  
  Quantum Narrative: Discussions about quantum computing's impact on cryptocurrencies, focusing on security and quantum resistance ($QANX).
  
  Regulatory Shifts: Speculations about U.S. policy changes under new political climates, potentially favoring cryptocurrencies like $XRP.
  
  XRP and Ripple Developments: Narratives of Ripple's legal victories, ETF filings, and innovations like RLUSD, positioning XRP for growth.
  
  Meme Coins and Market Cycles: Speculations about Solana ($SOL) and cyclical trends driven by community hype and marketing.
  
  Market Liquidity and Derivatives: Emphasis on liquidity and derivatives markets affecting assets like XRP and SOL.`,
    ];
  
    const openBottomSheet = (text: string) => {
      setCurrentText(text);
      setIsOpen(true);
    };
  
    const closeBottomSheet = () => setIsOpen(false);

    return (<div className="">

<div className="border-[#232425]  bg-[#1e1e1e]  flex flex-col  gap-1  border p-1 rounded-xl m-2">

<div className="flex flex-row items-center my-1 gap-3 justify-center">
            <img src="./assets/ai.png" className='h-[52px]' alt="" />
            <div className="">
                <h1 className='font-semibold text-lg'>Kabal AI</h1>

                <h2 className='text-xs my-2 items-center flex font-mono'>Your own intent based degen intern </h2></div>

                </div>

            <div className="border-[#232425] mt-2 bg-red-500 flex flex-row justify-between  border p-2 rounded-xl m-2"   onClick={() => openBottomSheet(texts[0])}>

                {/* <img src="./assets/laptop.png" className='h-[52px]' alt="" /> */}
                <div className="">
                    <h1 className='font-semibold text-lg'>Latest crypto narratives on X/Twitter</h1>

                    <h2 className='text-xs my-2 items-center flex font-mono'>Generate using Kabal AI  <ArrowRight className='h-[18px]' /></h2></div>
            </div>

            <div className="border-[#232425] mt-2 bg-orange-400 flex flex-row justify-between  border p-2 rounded-xl m-2"          onClick={() => openBottomSheet(texts[1])}>

                {/* <img src="./assets/laptop.png" className='h-[52px]' alt="" /> */}
                <div className="">
                    <h1 className='font-semibold text-lg'>Crypto news discussed on X/Twitter</h1>

                    <h2 className='text-xs my-2 items-center flex font-mono'>Generate using Kabal AI  <ArrowRight className='h-[18px]' /></h2></div>
            </div>
        </div>

        <h1 className="text-white font-semibold p-4">AI managed Funds</h1>
        <div className="">{


            AIFundsData.map(fund => <AICard {...fund} />)}</div>

        <div className="w-full flex justify-end items-center text-gray-400 text-xs my-1"> View more <ArrowRight className='h-[12px]' /> </div>




        <h1 className="text-white font-semibold p-4">AI Narrative Fund</h1>
        <div className="">{


            AINarratives.map(fund => <AICard {...fund} />)}</div>

        <div className="w-full flex justify-end items-center text-gray-400 text-xs my-1"> View more <ArrowRight className='h-[12px]' /> </div>
        <BottomSheet isOpen={isOpen} text={currentText} onClose={() => setIsOpen(false)} />

    </div>)
}

export default AIPage;


const AICard = (props: any) => {
    const positiveData = [100, 110, 105, 120, 115, 125];
    const negativeData = [100, 90, 95, 85, 80, 75];
    return (
        <div className="flex flex-row items-center justify-between p-2 gap-1 border-[#232425] bg-[#1e1e1e] border mx-2 mb-1 rounded">

            <img src={props.logo} className='h-[35px] bg-black rounded-full border border-gray-800' alt="" />

            <div className="flex flex-col "><h1 className='text-sm ml-2'>{props.name}</h1>


            </div><div className="">
                <PNLChart data={props.positive ? positiveData : negativeData} /></div>

            <div className="flex flex-col gap-1">
                <div className={props.positive ? 'text-green-400' : 'text-red-400'}>{props.per}%</div>
                <div className='text-xs'>{props.mcap} Avg MCap</div>

            </div>

        </div>)
}


import React, { useEffect, useState } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  text: string;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, text, onClose }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (isOpen) {
      let index = 0;
      setDisplayedText(""); // Clear previous content
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => prev + text[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50); // Adjust speed by modifying the interval time (e.g., 50ms per character)
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isOpen, text]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center  bg-[#1E1E1E] bg-opacity-30">

      <div className="relative w-full m-[2px] max-w-3xl bg-[#1E1E1E] p-4  rounded-t-lg h-[300px] overflow-y-auto max-h-[80%]">
  <button
          className="absolute top-1 right-1  rounded-md text-white/60 hover:bg-red-700 cursor-pointer"
          onClick={onClose}
        >
<X />
        </button>
        <pre
          className="text-green-400 font-mono pt-3 text-sm whitespace-pre-wrap animate-pulse"
          style={{ textShadow: "0px 0px 10px rgba(0, 255, 0, 0.8)" }}
        >
          {displayedText}
        </pre>
      </div>
    </div>
  );
};
