import { FaPlus } from "react-icons/fa6";
import { Outlet, useNavigate,useParams } from "react-router-dom";
import Header from "../../components/UpperNavBar";
import InlineTabs from "../../components/CompanyPageSections/InlineTabs"
import { useState } from "react";
import { TiEye } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
const CompanyProfileAdminViewPage = () => {
    const navigate = useNavigate();
    const {companyId, section = "Feed"} = useParams();
    const [activeTab, setActiveTab] = useState(section);
    const [notifications, setNotifications] = useState([]);
    const Tabs =["Feed","Activity","Analytics"];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/company/${companyId}/admin/${tab}`);
      };

    const handleClickCreateButton =() =>{
        console.log("create ")
    }
    
    const handleModifyCoverPicture=() =>{
        console.log("ModifyCoverPicture ")
    }

    return (
        <div className="bg-[#f4f2ee] min-h-screen  items-center flex flex-col">
            <Header notifications={notifications} />
            <div className="lg:w-1/2 lg:h-3/4">
                <div className="bg-white rounded-lg shadow-lg mt-16 relative"> 
                    <img src="/Images/card-bg.svg" alt="cover page" className="w-full h-30 rounded-t-lg" />
                        <button
                            className="absolute top-4 right-4 bg-white rounded-full shadow-md hover:cursor-pointer px-3 py-2 m-2"
                            aria-label="Change cover photo"
                            onClick={handleModifyCoverPicture}
                        >
                            <FontAwesomeIcon
                                className="text-[#005cb7] hover:text-[#004182]"
                                size="sm"
                                icon={faCamera}
                            />
                        </button>
                    <div className="flex flex-column justify-between">
                        <img src="/Images/building-icon.png" alt="profile" className="w-28 h-28 -mt-10 ml-5  " />
                        <button className="rounded-full  hover:bg-gray-100 m-4 p-4  ">
                        < MdModeEdit size=" 24"/>
                        </button>
                    </div>

                        <div className="px-5 pt-5">
                            <h1 className="text-2xl">Company Name</h1>
                            <p className="text-gray-500 text-sm">Industry</p>
                            <div className="flex gap-2">
                                <p className="text-gray-500 text-sm">Company Location</p>
                                <p className="text-gray-500 text-sm">Company Size</p>
                                <p className="text-gray-500 text-sm">number of employees</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="mt-4 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold py-2 px-8 rounded-full hover:bg-[#004182]" onClick={()=>{handleClickCreateButton()}}>
                                    <FaPlus className="w-4 h-4"  />
                                    Create 
                                </button> 
                                <button className="mt-4 flex items-center justify-center gap-2 bg-white text-gray-500  border-2 font-semibold py-2 px-8 rounded-full hover:bg-gray-200 "  onClick={()=>{navigate(`/company/${companyId}/`)}}>
                                    <TiEye className="size-6"  />
                                    View as a member
                                </button>
                            </div>
                        </div>
                        <hr className="border-gray-300 my-2" />
                        <InlineTabs activeTab={activeTab} Tabs={Tabs} handleTabClick={handleTabClick} />  
                </div>
                <div className="mt-4">
                   <Outlet />
                </div>
            </div>
        </div>
    )
}
export default CompanyProfileAdminViewPage;