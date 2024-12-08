import { PlusCircle, MoveRight, Send, CopyPlus, CopyMinus } from 'lucide-react'
import Link from 'next/link';
const ChatPage = () => {
    return (<div className="p-2 flex flex-col h-full justify-between">

        <div className="flex-grow h-full">
            <div className="flex flex-row items-center justify-between border-b-[1px] border-[#262626] p-3 font-semibold text-white">
                <div className="flex flex-row items-center gap-1 text-gray-300">$100 <span className="text-[0.5rem] text-green-500">+420%</span></div>
                <div className="flex flex-row items-center gap-2 font-mono text-[#DDFF00]">
                    <div className="flex h-7 w-7 items-center justify-center gap-1 rounded-full bg-blue-400">🚀</div>
                    Beta Fuck
                </div>
                <span className="mx-4 text-2xl text-[0.5rem] font-extralight text-blue-500"></span>
            </div>
            <div className="flex flex-col gap-4 my-3">


                <div className="flex flex-row justify-start">
                    <div className="flex flex-col gap-1">
                        <div className="mx-1 flex flex-row items-center gap-1">
                            <div className="h-5 w-5 rounded-full bg-gray-400"></div>
                            <h2 className="text-xs text-gray-500">altking 4:18am</h2>
                        </div>
                        <div className="max-w-[200px] rounded-full rounded-tl-none border border-[#CCCCCC]/20 bg-[#161616] p-3 text-sm text-[#CCCCCC]">look at the bubble map, it's fucked</div>
                    </div>
                </div>


                <div className="max-w-[200px] mx-auto rounded-full border border-red-400/20  p-1  text-xs px-2 text-[#CCCCCC]">altking sold <span className="text-red-500">5000 $NOHANDS</span></div>


                <div className="flex flex-row justify-start">
                    <div className="flex flex-col gap-1">
                        <div className="mx-1 flex flex-row items-center gap-1">
                            <div className="h-5 w-5 rounded-full bg-gray-400"></div>
                            <h2 className="text-xs text-gray-500">lysergic 4:20am</h2></div>
                        <div className="max-w-[200px] rounded-full rounded-tl-none border border-[#CCCCCC]/20 bg-[#161616] p-3 text-sm text-[#CCCCCC]">420</div>
                    </div>
                </div>
                <div className="flex flex-row justify-end">
                    <div className="rounded-full rounded-tr-none bg-gradient-to-r from-[#67E483] to-[#8FF053] p-3 text-sm font-semibold text-neutral-800">420</div>
                </div>


                <div className="flex flex-row justify-start">
                    <div className="flex flex-col gap-1">
                        <div className="mx-1 flex flex-row items-center gap-1">
                            <div className="h-5 w-5 rounded-full bg-gray-400"></div>
                            <h2 className="text-xs text-gray-500">memerizzer 4:18am</h2>
                        </div>
                        <div className="max-w-[200px] rounded-full rounded-tl-none border border-[#CCCCCC]/20 bg-[#161616] p-3 text-sm text-[#CCCCCC]">binance listing of chillguys soon</div>
                    </div>
                </div>




                <div className="max-w-[200px] mx-auto rounded-full border border-green-400/20 p-1  text-xs px-2 text-[#CCCCCC]">altking bought <span className="text-green-500">8000 $CHILLGUY</span></div>




                <div className="flex flex-row ] justify-end">
                    <div className="rounded-full max-w-[250px] rounded-tr-none bg-gradient-to-r from-[#67E483] to-[#8FF053] p-3 text-sm font-semibold text-neutral-800">bois working on a sniping bot need some degens for strat</div>
                </div>


            </div>
        </div>

        <div className="flex flex-row gap-1">

            <div className="rounded border border-[#CCCCCC]/20 bg-[#161616] rounded-full justify-end flex px-3  w-full p-2 "> <Send className='mr-1' /></div>

            <div className="bg-[#161616] border border-[#CCCCCC]/20 p-2 flex flex-col gap-1 items-center  justify-center rounded-full h-[40px] w-[40px]">
                <CopyPlus className='h-[20px]' /> </div>
                
                  <div className="bg-[#161616] border border-[#CCCCCC]/20 p-2 flex items-center  justify-center rounded-full h-[40px] w-[40px]">
                <CopyMinus className='h-[20px]' /></div>
        </div>

    </div>)
}

export default ChatPage;