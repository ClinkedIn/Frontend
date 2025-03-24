
type InlineTabsProbs= {
    activeTab?: string;
    Tabs: Array<string>
    handleTabClick: (tab: string) => void
};


const InlineTabs =({activeTab, Tabs, handleTabClick}:InlineTabsProbs) =>{
    return(
        <div className="mb-4 px-2 border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                {Tabs.map((tab) => (
                <li key={tab} className="me-2" role="presentation">
                    <button
                    className={`inline-block p-4  rounded-t-lg ${
                        activeTab === tab
                        ? "text-green-600 border-b-2 border-green-600"
                        : "hover:text-gray-600 hover:border-gray-300"
                    }`}
                    id={`${tab}-tab`}
                    onClick={() => handleTabClick(tab)}
                    type="button"
                    role="tab"
                    aria-controls={tab}
                    aria-selected={activeTab === tab}
                    >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                </li>
                ))}
            </ul>
        </div>
    )
}

export default InlineTabs;