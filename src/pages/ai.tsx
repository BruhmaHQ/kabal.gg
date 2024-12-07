import { PNLChart } from '@/components/atoms/PNLChart';
import { ArrowRight } from 'lucide-react'
const AIPage = () => {

    const AIFundsData: any[] = [
        {
          id: 'grok-narratives',
          name: 'GrokAI Narratives',
          logo: './assets/grok.sbvg', // Placeholder path
          positive: true,
          per: 12.5,
          mcap: '$420M',
          performanceData: [100, 110, 105, 120, 115, 125]
        },
        {
          id: 'perplexity-insights',
          name: 'Perplexity Narative',
          logo: './assets/perplexity', // Placeholder path
          positive: true,
          per: 9.3,
          mcap: '$350M',
          performanceData: [100, 108, 112, 118, 122, 130]
        },
      ];
      

      const AINarratives =[{
        id: 'anthropic-transformer',
        name: 'Virtuals Tokens',
        logo: '/logos/anthropic.png', // Placeholder path
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

    return (<div className="">

        <div className="border-[#232425] bg-[#1e1e1e] flex flex-row justify-between  border p-2 rounded-xl m-2">

            <img src="./assets/laptop.png" className='h-[52px]' alt="" />
            <div className="">

                <h2 className='text-xs my-2 items-center flex font-mono'>Generate using Kabal AI  <ArrowRight className='h-[18px]' /></h2></div>
        </div>

        <h1 className="text-white font-semibold p-4">AI managed Funds</h1>
<div className="">{
    
    
    AINarratives.map(fund =>)}</div>


        <div className="flex flex-row gap-1 border-[#232425] bg-[#1e1e1e] border mx-2 rounded">

            <img src="./assets/perplexity.png" className='h-[35px]  bg-black rounded-full border border-gray-800' alt="" />

            <div className="flex flex-col"><h1 >Perplexity AI Narratives</h1>
                <h2 className='text-xs'>Invests in latest narratives on the internet</h2></div>
        </div>




        <h1 className="text-white font-semibold p-4">AI Narrative Fund</h1>
        <div className="border-[#232425] bg-[#1e1e1e] flex flex-row justify-between  border p-2 rounded-xl m-2">

            <img src="./assets/laptop.png" className='h-[52px]' alt="" />
            <div className="">
                <h1 className='font-semibold'>
                    Latest narratives analyzed from X/Twitter
                </h1>
                <h2 className='text-xs my-2 items-center flex font-mono'>Generate using Kabal AI  <ArrowRight className='h-[18px]' /></h2></div>
        </div>
        <div className="h-[200px]"></div>

    </div>)
}

export default AIPage;


const AICard = (props: any) => {
    const positiveData = [100, 110, 105, 120, 115, 125];
    const negativeData = [100, 90, 95, 85, 80, 75];
    return (
        <div className="flex flex-row items-center p-2 gap-1 border-[#232425] bg-[#1e1e1e] border mx-2 rounded">

            <img src={props.logo} className='h-[35px] p-2 bg-black rounded-full border border-gray-800' alt="" />

            <div className="flex flex-col "><h1 className='text-sm ml-2'>GrokAI Narratives</h1>


            </div><div className="">
                <PNLChart data={props.performanceData ?? props.positive ? positiveData : negativeData} /></div>

            <div className="flex flex-col gap-1">
                <div className={props.positve ? 'text-green-400' : 'text-red-400'}>{props.per}%</div>
                <div className='text-xs'>{props.mcap} Avg MCap</div>

            </div>

        </div>)
}