import { cn } from "@/lib/utils";

type TrendingCardProps = {
    icon: string;
    title: string;
    section: { title: string, percentage: number, isPositive: boolean }[]
}
export const TrendingCard: React.FC<TrendingCardProps> = (props) => {
    return (
        <div className="bg-gradient-to-tl to-[#0ABB90]  from-violet-500 p-[1px] rounded">
            <div className=" min-w-[300px] rounded border border-[#262626] bg-[#2B2B2B]  p-2 text-white">
                <h1 className="flex flex-row items-center justify-start gap-2 font-semibold">
                    <div className="">{props.icon}</div>
                    {props.title}
                </h1>
                <div className="m-1 my-2 flex flex-col gap-1">
                    {props.section.map(sec => {
                        return (
                            <div className="flex w-full flex-row justify-between gap-5">
                                <h1 className="text-sm text-gray-200">{sec.title}</h1>
                                <h2 className={cn("text-xs ", sec.isPositive ? 'text-green-500' : 'text-red-500')}>{sec.percentage}%</h2>
                            </div>
                        )
                    })}
                </div>
            </div>
            </div>

    )
}