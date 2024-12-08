import { PNLChart } from '@/components/atoms/PNLChart';
import { ArrowRight } from 'lucide-react'
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

    return (<div className="">

<div className="border-[#232425]  bg-[#1e1e1e]  flex flex-col  gap-1  border p-1 rounded-xl m-2">

<div className="flex flex-row items-center my-1 gap-3 justify-center">
            <img src="./assets/ai.png" className='h-[52px]' alt="" />
            <div className="">
                <h1 className='font-semibold text-lg'>Kabal AI</h1>

                <h2 className='text-xs my-2 items-center flex font-mono'>Your own intent based degen intern </h2></div>

                </div>

            <div className="border-[#232425] mt-2 bg-red-500 flex flex-row justify-between  border p-2 rounded-xl m-2">

                {/* <img src="./assets/laptop.png" className='h-[52px]' alt="" /> */}
                <div className="">
                    <h1 className='font-semibold text-lg'>Latest crypto narratives on X/Twitter</h1>

                    <h2 className='text-xs my-2 items-center flex font-mono'>Generate using Kabal AI  <ArrowRight className='h-[18px]' /></h2></div>
            </div>

            <div className="border-[#232425] mt-2 bg-orange-400 flex flex-row justify-between  border p-2 rounded-xl m-2">

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