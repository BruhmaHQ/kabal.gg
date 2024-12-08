import { Compass, House, Check } from 'lucide-react';

const RewardsPage = () => {
    return (<div className="">

        <h1 className="text-white font-semibold p-4">Rewards</h1>
        <div className="flex flex-col gap-2">
            <div className=" bg-rose-300 text-neutral-800 rounded-[30px] p-4  m-1">

                <div className="bg-[] flex flex-row justify-evenly w-full items-center">
                    <img src="./assets/airdrop.png" className="h-[80px]" alt="" />

                    <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold  ">Your points</span>
                        <h1 className="text-[40px] font-bold font-mono font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent font-mono">200



                        </h1></div></div></div>



            <div className="relative bg-[#FFDA9C] text-neutral-800 rounded-[30px] p-4 pt-2 m-1">
                <div className="flex flex-row gap-4 w-full items-end justify-around">

                    <div className="w-full">
                        <div className="py-4 pb-1">
                            <h1 className="text-lg  font-semibold ">Unlock Lootbox</h1>
                            <div className='text-[12px] line'>Complete quests and earn reward points</div>
                            <div className='text-[12px] font-semibold line pt-2'>200/1000</div>
                        </div>
                        <div className="flex bg-yellow-50 rounded-full h-[8px]  w-full mb-4 ">
                            <div className="w-[20%] h-[8px] bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-full "></div></div></div>
                    <img src="./assets/gift.png" alt="" className='h-[80px]' />
                </div>

            </div>

            <div className="relative bg-blue-400 text-neutral-800 rounded-[30px] p-1 m-1 ">


                <div className="flex w-full justify-between items-center mb-1 ">

                    <img src="./assets/freinds.png" alt="" className='h-[80px]' />
                    <div className="px-4">
                        <h1 className="text-lg p font-semibold pt-6">Refer a friend for 200 points</h1>
                        <div className='text-[12px] line'>Successfull referal requires account creation and minimum deposit of $30 dollars</div>
                    </div>


                </div>



                <div className="flex px-5 py-3  flex-row w-full justify-around">
                    <div className="bg-green-500 border border-neutral-800 rounded-full w-[40px] h-[40px] flex items-center justify-center "><Check className='w-[24px] h-[24px] ' strokeWidth={2.5} /></div>
                    <div className="w-[40px] h-[40px] border border-neutral-800 rounded-full bg-blue-300"></div>
                    <div className="w-[40px] h-[40px] border border-neutral-800 rounded-full bg-blue-300"></div>
                    <div className="w-[40px] h-[40px] border border-neutral-800 rounded-full bg-blue-300"></div>
                    <div className="flex items-center h-[40px] border border-neutral-800 rounded px-3 bg-blue-300"> AKX-420</div>
                </div>


            </div>


            <div className="">
                <h1 className="text-white font-semibold p-4 ">Available Quests</h1>
                <div className="grid grid-cols-2 gap-3 m-2">

                    <div className="bg-[#232425] border-gray-700 border p-2 rounded-xl">
                        <h1 className='font-semibold'>
                            Refer a friend
                        </h1>
                        <h2 className='text-sm'>200 points</h2>
                    </div>

                    <div className="bg-[#232425] border-gray-700 border p-2 rounded-xl">
                        <h1 className='font-semibold'>
                            Invest in a index fund
                        </h1>
                        <h2 className='text-sm'>200 points</h2>
                    </div>

                    <div className="bg-[#232425] border-gray-700 border p-2 rounded-xl">
                        <h1 className='font-semibold'>
                            Create a group chat
                        </h1>
                        <h2 className='text-sm'>50 points</h2>
                    </div>

                    <div className="bg-[#232425] border-gray-700 border p-2 rounded-xl">
                        <h1 className='font-semibold'>
                            Use Kabal AI
                        </h1>
                        <h2 className='text-sm'>50 points</h2>
                    </div>
                </div>

            </div></div>


    </div >)
}

export default RewardsPage;