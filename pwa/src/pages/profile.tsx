import {Expand} from 'lucide-react'
import { useAccount } from 'wagmi';

const ProfilePage = () => {
    const { address } = useAccount()
    return (<div className=""><div className="m-1 flex flex-col items-center gap-1">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-[#FF9502] to-[#b5ed5a] text-[3rem]">👽</div>


        <h1 className="my-2 text-xl font-semibold text-white">Memerizzer</h1>
        <h2 className="text-lg text-white/80">$3,000</h2>
        <h2 className='text-lg text-white/80'>{address}</h2>


        <div className="my-4 text-neutral-800 grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDFF00] text-[2rem]">+</div>
                <h2 className="text-sm text-white/60">Add Funds</h2>
            </div>


            <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDFF00] text-[2rem]">+</div>
                <h2 className="text-sm text-white/60">Swap</h2>
            </div>


            <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDFF00] text-[2rem]">+</div>
                <h2 className="text-sm text-white/60">Off Ramp</h2>
            </div>


            <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDFF00] text-[2rem]">+</div>
                <h2 className="text-sm text-white/60">Copy</h2>
            </div>
        </div>


    </div><div className=" my-4 mx-2 rounded-lg border border-[#CCCCCC]/20 bg-[#161616] p-2 text-white">
            <h1 className="flex flex-row items-center justify-between gap-2 text-xl font-semibold">Portfolio  <Expand className='text-neutral-300 h-[18px]'/></h1>
            <div className="mx-5 my-5 grid grid-cols-2 gap-y-2">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xs text-gray-400">P&L</h2>
                    <h1 className="text-green-500">$100 <span className="text-xs">+34.5%</span></h1>
                </div>
                <div className="flex h-full flex-col justify-between gap-1">
                    <h2 className="text-xs text-gray-400">XIRR</h2>
                    <h1 className="t text-xs text-green-500">+17.32%</h1>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-xs text-gray-400">Invested</h2>
                    <h1 className="text-xs text-white">$100</h1>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-xs text-gray-400">Current</h2>
                    <h1 className="t text-xs text-white">$300</h1>
                </div>
            </div><div className="m-1 my-3 flex flex-col gap-1">
                <h1 className="font-semibold mb-2">Top Gainers</h1>
                <div className="flex w-full flex-row justify-between gap-5">
                    <h1 className="text-sm text-gray-200">Christmas themmed</h1>
                    <h2 className="text-xs text-green-500">103.8%</h2>
                </div>
                <div className="flex w-full flex-row justify-between gap-5">
                    <h1 className="text-sm text-gray-200">Yield optimizer</h1>
                    <h2 className="text-xs text-green-500">39.7%</h2>
                </div>
                <div className="flex w-full flex-row justify-between gap-5">
                    <h1 className="text-sm text-gray-200">Name service</h1>
                    <h2 className="text-xs text-green-500">35.1%</h2>
                </div>
            </div></div>
    </div>
    )
}

export default ProfilePage;