import { FaPlus } from "react-icons/fa6";
import { Outlet, useNavigate,useParams } from "react-router-dom";
import Header from "../../components/UpperNavBar";
import { useEffect, useState } from "react";
import InlineTabs from "../../components/CompanyPageSections/InlineTabs"
import axios from "axios";
import { BASE_URL } from "../../constants";
const CompanyProfileMemberViewPage = () => {
    const navigate = useNavigate();
    const {companyId, section = "Home"} = useParams();
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState(section);
    const [notifications, setNotifications] = useState([]);
    const [companyInfo, setCompanyInfo] = useState();
    const Tabs =["Home", "Posts", "Jobs"];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/company/${companyId}/${tab}`);
      };

    const handleClickFollowingButton = async(e) => {
        e.preventDefault();
        const userId ={user_Id :"12345"}
        if(isFollowing) {
            const response = await axios.delete(`${BASE_URL}/companies/${companyId}/unfollow`,{userId});
            console.log(response)
            setIsFollowing(false);

        }
        else{
            const response = await axios.post(`${BASE_URL}/companies/${companyId}/follow`,{userId});
            console.log(response)
            setIsFollowing(true);
        }
    }
    const fetchCompanyInfo=async()=>{
        try {
            const response = await axios.get(
                `${BASE_URL}/companies/${companyId}`
            );
            setCompanyInfo(response.data); 
        } catch (error) {
            console.error("Error fetching company info:", error);
         }
    }
    useEffect(()=>{
        if(!companyInfo)
             fetchCompanyInfo();
    },[]);

    return (
        <div className="bg-[#f4f2ee] min-h-screen  items-center flex flex-col">
            <Header  notifications={notifications} />
            {companyInfo &&
            <div className="lg:w-1/2 lg:h-3/4 md:w-3/4 max-[430px]:w-full">
                <div className="bg-white  rounded-lg shadow-lg mt-16  ">
                    <img src="/Images/card-bg.svg"  className="w-full h-30 rounded-t-lg " />
                    <img src={companyInfo.logo ? companyInfo.logo : "/Images/Company-icon.png" } alt="profile" className="w-28 h-28 -mt-10 ml-5  " />
                    <div className="px-5 pt-5">
                        <h1 className="text-2xl">{companyInfo.name}</h1>
                        <div className="flex gap-2">
                        <p className="text-gray-500 text-sm">{companyInfo.industry} </p>
                        <p className="text-gray-500 text-sm">{companyInfo.address}   </p>
                        <p className="text-gray-500 text-sm">{companyInfo.followers.length} followers   </p>
                        <p className="text-gray-500 text-sm">{companyInfo.organizationSize}  employees</p>
                        </div>
                        <div className="flex gap-4  max-[430px]:flex-col max-[430px]:gap-0 ">
                            {(isFollowing) ? (
                            
                            <button className="mt-4 py-1 flex items-center justify-center bg-[#EBF4FD] text-[#0A66C2]  border-2 font-semibold  px-8 rounded-full hover:bg-blue-200 "  onClick={()=>{handleClickFollowingButton()}}>
                                Following
                            </button>) : (
                                <button className="mt-4 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold py-2 px-8 rounded-full hover:bg-[#004182]" onClick={()=>{handleClickFollowingButton()}}>
                                <FaPlus className="w-4 h-4"  />
                                Follow
                            </button> 
                            )}
                        </div>
                    </div>
                    <hr className="border-gray-300 my-2" />
                    <InlineTabs activeTab={activeTab} Tabs={Tabs} handleTabClick={handleTabClick} />
                </div>
                <div className="mt-4">
                    <Outlet  context={{ companyInfo }} />
                </div>

            </div>
            }
        </div>
                
    )
}
export default CompanyProfileMemberViewPage;