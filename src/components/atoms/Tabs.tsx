import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

const Tabs: React.FC<{
    layoutid: string;
    tabs: Array<{ key: string; label: string |any}>;
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}> = ({ tabs, activeTab, setActiveTab, layoutid }) => {
    return (
        <div className="rounded items-center   p-[4px] text-[#989898] text-xs flex flex-row gap-3">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`${activeTab === tab.key
                            ? " bg-transparent text-black "
                            : " hover:text-white/80 "
                        } relative rounded border border-solid border-white/[.145] text-nowrap transition-colors  py-[5px] px-[10px] flex items-center  justify-center`}
                    style={{
                        WebkitTapHighlightColor: "transparent",
                    }}
                >
                    {activeTab === tab.key && (
                        <motion.span
                            layoutId={layoutid}
                            className="absolute inset-0 z-0 bg-foreground drop-shadow"
                            style={{ borderRadius: 9999 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <div className="z-10 no-wrap text-"> {tab.label}</div>
                </button>
            ))}
        </div>


    );
};

export default Tabs;
