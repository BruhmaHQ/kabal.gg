import { PNLChart } from '@/components/atoms/PNLChart';
import ReactECharts from 'echarts-for-react';
const option = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        top: '5%',
        left: 'center'
    },
    series: [
        {
            name: 'Aptos Infra',
        type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 40,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 40, name: '$THL' },
                { value: 30, name: '$CEL' },
                { value: 30, name: '$MKL' },


            ]
        }
    ]
};


 const CasePage = () => {

    return (<div>


        <div className=" p-2">
            <div className="flex flex-row items-center justify-between border-b-[1px] border-[#262626] p-3 font-semibold text-white">
                <div className="flex flex-row items-center gap-1 text-gray-300">$100 <span className="text-[0.5rem] text-green-500">+420%</span></div>
                <div className="flex flex-row items-center gap-2 font-mono text-[#DDFF00]">
                    <div className="flex h-7 w-7 items-center justify-center gap-1 rounded-full bg-blue-400">🛠️</div>
                    APT Infra Bag
                </div>


                <span className="mx-4 text-2xl text-[0.5rem] font-extralight text-blue-500"></span>
            </div>
            <div className="m-2">
                <div className="h-[200px] rounded-lg border border-[#CCCCCC]/20 bg-[#161616] p-3 text-sm text-[#CCCCCC]">
                    <div className="flex flex-row justify-between">
                        APT INFRA
                        <div className="text-green-500">+420% <span className="mx-2 text-xs">+2$</span></div>
                    </div>
                    <div className="flex items-center justify-center">
                    <PNLChart height={200} width={300} data={[12,18,19,15,10,9,8,11,12,11,14,16,22]} />
                    </div>
                </div>
            </div>


            <div className="min-h-[400px] text-white">

            <ReactECharts option={option} />
            </div>


            <div className="rounded border border-[#262626] bg-[#1D1D1D]"><input  className="w-full bg-transparent p-2 text-sm text-gray-300" type="number" placeholder="Enter Amount" /></div>


            <div className="my-4 flex h-8 w-full flex-row items-center rounded border border-[#262626] text-sm text-neutral-900">
                <div className="w-[40%] rounded-l bg-indigo-500 p-2 px-1">$40 Thala</div>
                <div className="w-[30%] bg-yellow-400 p-2 px-1">$30 Cellana</div>
                <div className="w-[30%] rounded-r bg-green-400 p-2 px-1">$30 Thalla</div>
            </div>


            <div className="my-2 flex flex-col gap-2">
                <div className="w-full rounded-lg bg-[#11362E] p-2 text-center text-lg text-[#2FA788]">One Time</div>
                <div className="flex w-full flex-row items-center rounded-lg bg-[#0ABB90] text-lg text-white">
                    <div className="w-full p-2 text-center">SIP</div>
                </div>
            </div>
        </div>
    </div >)
} 
export default CasePage;