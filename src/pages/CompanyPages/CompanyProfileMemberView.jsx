import { FaPlus } from "react-icons/fa6";
import { Outlet, useNavigate,useParams } from "react-router-dom";
import Header from "../../components/UpperNavBar";
import { useEffect, useState } from "react";
import InlineTabs from "../../components/CompanyPageSections/InlineTabs"
import axios from "axios";
const CompanyProfileMemberViewPage = () => {
    const navigate = useNavigate();
    const {companyId, section = "Home"} = useParams();
    const [isFollowed, setIsFollowed] = useState(false);
    const [activeTab, setActiveTab] = useState(section);
    const [notifications, setNotifications] = useState([]);
    const [company, setCompany] = useState();
    const Tabs =["Home", "Posts", "Jobs"];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/company/${companyId}/${tab}`);
      };

    const handleClickFollowingButton = () => {
        if(isFollowed) {
        setIsFollowed(false);
        }
        else{
        setIsFollowed(true);
        }
    }
    const fetch=async()=>{
 try {
      const response = await axios.get(
        "http://localhost:5173/companies/12345"
      );
      setCompany(response.data); // Set fetched notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
    }
    useEffect(()=>{
       fetch();
    },[]);

    return (
        <div className="bg-[#f4f2ee] min-h-screen  items-center flex flex-col">
            <Header  notifications={notifications} />
            {company &&
            <div className="lg:w-1/2 lg:h-3/4">
                <div className="bg-white  rounded-lg shadow-lg mt-16  ">
                    <img src="/Images/card-bg.svg" alt="profile" className="w-full h-30 rounded-t-lg " />
                    <img src={company.logo} alt="profile" className="w-28 h-28 -mt-10 ml-5  " />
                    <div className="px-5 pt-5">
                        <h1 className="text-2xl">{company.name}</h1>
                        <div className="flex gap-2">
                        <p className="text-gray-500 text-sm">{company.industry} </p>
                        <p className="text-gray-500 text-sm">{company.address}   </p>
                        <p className="text-gray-500 text-sm">{company.followers.length} followers   </p>
                        <p className="text-gray-500 text-sm">{company.organizationSize}  employees</p>
                        </div>
                        <div className="flex gap-4">
                            {(isFollowed) ? (
                            
                            <button className="mt-4 flex items-center justify-center bg-[#EBF4FD] text-[#0A66C2]  border-2 font-semibold  px-8 rounded-full hover:bg-blue-200 "  onClick={()=>{handleClickFollowingButton()}}>
                                Following
                            </button>) : (
                                <button className="mt-4 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold py-2 px-8 rounded-full hover:bg-[#004182]" onClick={()=>{handleClickFollowingButton()}}>
                                <FaPlus className="w-4 h-4"  />
                                Follow
                            </button> 
                            )}
                            <button className="mt-4  flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold py-2 px-8 rounded-full hover:bg-[#004182]">
                                Send a message
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
            }
        </div>
                
    )
}
export default CompanyProfileMemberViewPage;