import { Search, Sparkle } from 'lucide-react'
const SearchPage = () => {
    return (<div className="p-2">
        <div className="rounded bg-[#161616] rounded-full w-full p-2 my-2"><Search /></div>
        <div className="grid grid-cols-2 gap-2 mb-4">

            <div className="bg-purple-500 rounded-2xl h-full p-3 my-2"> <h1 className='flex flex-row items-center font-semibold mb-4'><Sparkle fill='white' className='h-[18px]' />Learn</h1>

                <h2 className='opacity-80 text-xs font-bold'>Staying Safe</h2>
                <h2 className='text-xl font-bold'>Avoiding Crypto Scams</h2></div>

            <div className="bg-orange-500 rounded-2xl h-full p-3 my-2"> <h1 className='flex flex-row items-center font-semibold mb-4'><Sparkle fill='white' className='h-[18px]' />Learn</h1>

                <h2 className='opacity-80 text-xs font-bold'>Technology</h2>
                <h2 className='text-xl font-bold'>How L2s and rollups work</h2></div>
        </div>


        <div className="bg-green-500 rounded-2xl h-full p-3"> <h1 className='flex flex-row items-center font-semibold mb-4'><Sparkle fill='white' className='h-[18px]' />Quests</h1>

            <h2 className='opacity-80 text-xs font-bold'>200 points</h2>
            <h2 className='text-xl font-bold'>Import a telegram group to create a tradable kabal chat</h2></div>

        <div className="bg-blue-500 rounded-2xl h-full p-3 my-2"> <h1 className='flex flex-row items-center font-semibold mb-4'><Sparkle fill='white' className='h-[18px]' />Learn</h1>

            <h2 className='opacity-80 text-xs font-bold'>Essentials</h2>
            <h2 className='text-xl font-bold'>The importance of Backups</h2></div>

    </div>
    )
}

export default SearchPage;