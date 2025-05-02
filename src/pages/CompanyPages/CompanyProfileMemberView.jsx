import { FaPlus } from "react-icons/fa6";
import { Outlet, useNavigate,useParams,useLocation } from "react-router-dom";
import Header from "../../components/UpperNavBar";
import { use, useEffect, useState } from "react";
import InlineTabs from "../../components/CompanyPageSections/InlineTabs"
import axios from "axios";
import { BASE_URL } from "../../constants";
import { set } from "date-fns";
const CompanyProfileMemberViewPage = () => {
    const navigate = useNavigate();
    const {companyId, section = "Home"} = useParams();
    const [isFollowing, setIsFollowing] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [companyInfo, setCompanyInfo] = useState();
    const [user, setUser] = useState(null);
    const [followers, setFollowers] = useState([]);
    const Tabs =["Home", "Posts", "Jobs"];
    const location = useLocation();
    const currentSection = location.pathname.split('/').pop() || 'Home';
    const [activeTab, setActiveTab] = useState(currentSection);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errorFetchCompanyInfo, setErrorFetchCompanyInfo] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/company/${companyId}/${tab}`);
      };
      useEffect(() => {
        const fetchUser = async () => {
            try {
              const response = await axios.get(`${BASE_URL}/user/me`, {
            
                withCredentials:true
              });
          
              setUser(response.data.user);
              console.log("User data:", response.data.user);
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          };
      
          fetchUser();
          if ( user?._id) {("userId:", user?._id);
            console.log(" followers:", user?.following );
            const isUserFollowing = user?.following?.some((follower) => follower?.entity === companyId && follower?.entityType === "Company");
            setIsFollowing(isUserFollowing);
            const isAdmin = user?.adminInCompanies.some((CompanyId) => CompanyId === companyId );
            setIsAdmin(isAdmin);
            console.log("isAdmin:", isAdmin);
        }

      }, [user?._id]);
    useEffect(() => {
          const fetchFollowers = async() =>{
            try {
                const response = await axios.get(`${BASE_URL}/companies/${companyId}/follow`);
                setFollowers(response.data.followers);
                setCompanyInfo((prev) => ({ ...prev, followers: response.data.followers }));
                console.log("Followers data:", response.data.followers);
            } catch (error) {
                console.error("Error fetching followers:", error);
            }
             

          }
            fetchFollowers();

    }, 
    [user?._id,]);

    const handleClickFollowingButton = async(e) => {

        e.preventDefault();
        const userId = user?._id;
        if(isFollowing) {
            const response = await axios.delete(`${BASE_URL}/companies/${companyId}/follow`,{userId});
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
            setCompanyInfo(response.data.company);
            console.log("Company info:", response.data.company); 
        } catch (error) {
            console.error("Error fetching company info:", error);
            setErrorFetchCompanyInfo(true);
         }
    }
    useEffect(()=>{
        if(!companyInfo)
             fetchCompanyInfo();
    },[]);
    if(errorFetchCompanyInfo){
        return(
            <div className=" bg-[#f4f2ee] min-h-screen  items-center flex flex-col   w-full rounded-lg shadow-lg p-4 ">
                <Header notifications={notifications} />
                <h1 className="mt-30 text-2xl  ">Page not found</h1>
            </div>
        )
    }
    return (
        <div className="bg-[#f4f2ee] min-h-screen  items-center flex flex-col">
            <Header  notifications={notifications} />
            {companyInfo &&
            <div className="lg:w-1/2 lg:h-3/4 md:w-3/4 max-[430px]:w-full">
                <div className="bg-white  rounded-lg shadow-lg mt-16  ">
                    <img src="/Images/card-bg.svg"  className="w-full h-30 rounded-t-lg " />
                    <img src={companyInfo.logo !==null ? companyInfo.logo : "/Images/CompanyLogo.png" } alt="profile" className="w-28 h-28 -mt-10 ml-5  " />
                    <div className="px-5 pt-5">
                        <h1 className="text-2xl">{companyInfo.name}</h1>
                        <div className="flex gap-2">
                        <p className="text-gray-500 text-sm">{companyInfo.industry} </p>
                        <p className="text-gray-500 text-sm">{companyInfo.location}   </p>
                        <p className="text-gray-500 text-sm">{companyInfo.followersCount} followers   </p>
                        <p className="text-gray-500 text-sm">{companyInfo.organizationSize}  employees</p>
                        </div>
                        <div className="flex gap-4  max-[430px]:flex-col max-[430px]:gap-0 ">
                            {(isFollowing) ? (
                            
                            <button className="mt-4 py-1 flex items-center justify-center bg-[#EBF4FD] text-[#0A66C2]  border-2 font-semibold  px-8 rounded-full hover:bg-blue-200 "  onClick={handleClickFollowingButton}>
                                Following
                            </button>) : (
                                <button className="mt-4 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold py-2 px-8 rounded-full hover:bg-[#004182]" onClick={handleClickFollowingButton}>
                                <FaPlus className="w-4 h-4"  />
                                Follow
                            </button> 
                            )}
                            {isAdmin && (
                                <button className="mt-4 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold py-2 px-8 rounded-full hover:bg-[#004182]" onClick={() => navigate(`/company/${companyId}/admin`)}>
                                    Show as Admin
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