import { FaPlus } from "react-icons/fa6";
import { Outlet, useNavigate,useParams,useLocation } from "react-router-dom";
import Header from "../../components/UpperNavBar";
import InlineTabs from "../../components/CompanyPageSections/InlineTabs"
import { useState,useEffect } from "react";
import { TiEye } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import CompanyForm from "../../components/CompanyPageSections/CompanyPageForm";
import axios from "axios";
import { putRequest } from "../../services/axios";
import { BASE_URL } from "../../constants";
import { set } from "date-fns";
import {toast,Toaster} from "react-hot-toast";


const CompanyProfileAdminViewPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const {companyId, section = "Feed"} = useParams();
    const [isUpdating, setIsUpdating] = useState(false);
    const [companyInfo, setCompanyInfo] = useState();
    const [showForm, setShowForm] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [tagline, setTagline] = useState("");
    const [industry, setIndustry] = useState("");
    const [organizationType, setOrganizationType] = useState("");
    const [organizationSize, setOrganizationSize] = useState("");
    const [website, setWebsite] = useState("");
    const [checkbox, setCheckbox] = useState(false);
    //const [logo, setLogo] = useState<File | null>(null);
    const [companyAddress, setCompanyAddress] = useState("");   
    const [logoPreview, setLogoPreview] = useState(null);
    const [logo, setLogo] = useState(null);
    const [location, setCompanyLocation] = useState("");
    const [errors, setErrors] = useState({ });
    const [notifications, setNotifications] = useState([]);
    const Tabs =["Feed","Activity","Analytics"];
    const locationState = useLocation();
    const currentSection = locationState.pathname.split('/').pop() || 'Feed';
    const [activeTab, setActiveTab] = useState(currentSection);
    const [isAdmin, setIsAdmin] = useState(false);
    const [errorFetchCompanyInfo, setErrorFetchCompanyInfo] = useState(false);

     /**
       * Fetches current user profile data
       * @async
       * @function
       */


    const isValid = () => {
        let newErrors = {};

        if (!companyName) {
            newErrors.companyName = "Please enter the company name";
        } else {
            newErrors.companyName = "";
        }
    
        if (!companyAddress) {
            newErrors.companyAddress = "Please enter the company address";
        } else {
            newErrors.companyAddress = "";
        }
    
        const pattern = /^(https?:\/\/|www\.)[a-zA-Z0-9.-]+\.(com|org)(:\d+)?(\/\S*)?(\?\S*)?$/;
        if (!website ||  !pattern.test(website)) {
            newErrors.website = "Please enter a valid website URL.";
        } else {
            newErrors.website = "";
        }
    
        if (!organizationSize) {
            newErrors.organizationSize = "Please choose a valid option.";
        } else {
            newErrors.organizationSize = "";
        }
    
        if (!organizationType) {
            newErrors.organizationType = "Please choose a valid option.";
        } else {
            newErrors.organizationType = "";
        }
    
        if (!industry) {
            newErrors.industry = "Please enter the industry";
        } else {
            newErrors.industry = "";
        }
        if (!location) {
            newErrors.companyLocation = "Please enter the company location";
        } else {
            newErrors.companyLocation = "";
        }
    

        
        setErrors(newErrors);
        return Object.keys(newErrors).filter((key) => newErrors[key]).length === 0;
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/company/${companyId}/admin/${tab}`);
      };

    const handleClickCreateButton =() =>{
        console.log("create ")
    }


    const fetchCompanyInfo=async()=>{
        try {
            const response = await axios.get(
                `${BASE_URL}/companies/${companyId}`
            );
            setCompanyInfo(response.data.company); 
            setCompanyName(response.data.company.name)
            setCompanyAddress(response.data.company.address)
            setWebsite(response.data.company.website)
            setIndustry(response.data.company.industry)
            setOrganizationSize(response.data.company.organizationSize)
            setOrganizationType(response.data.company.organizationType)
            setLogoPreview(response.data.company.logo)
            setTagline(response.data.company.tagLine)
            setCompanyLocation(response.data.company.location)
            setLogo(response.data.company.logo)
            console.log("company data:", response.data);
            
        } catch (error) {
            console.error("Error fetching company info:", error);
            setErrorFetchCompanyInfo(true);
         }
    }
    useEffect(() => {
        const fetchUser = async () => {
            try {
              const response = await axios.get(`${BASE_URL}/user/me`, {
            
                withCredentials:true
              });
          
                setUser(response.data.user);
                console.log("User data:", response.data.user);
                const isAdmin = user?.adminInCompanies.some((CompanyId) => CompanyId === companyId );
                setIsAdmin(isAdmin);
                console.log("isAdmin:", isAdmin);
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          };
      
          fetchUser();
      }, []);
    /*useEffect(() => {
        if (user?._id && isAdmin === false) {
            navigate(`/company/${companyId}/Home`);
        }
    }, [user?._id, isAdmin]);*/
      const handleUpdatePage = async (e) => {
        e.preventDefault();
        if (!isValid()) return;
        
        setIsUpdating(true);
        try {
            const formData = new FormData();
        
            
            formData.append('name', companyName);
            formData.append('address', companyAddress);
            formData.append('website', website);
            formData.append('industry', industry);
            formData.append('organizationSize', organizationSize);
            formData.append('organizationType', organizationType);
            formData.append('tagLine', tagline);
            formData.append('location', location);
            
            formData.append('file', logo);
    
            const response = await axios.patch(`${BASE_URL}/companies/${companyId}`, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            
            
                setCompanyInfo(response.data.company); 
                setCompanyName(response.data.company.name)
                setCompanyAddress(response.data.company.address)
                setWebsite(response.data.company.website)
                setIndustry(response.data.company.industry)
                setOrganizationSize(response.data.company.organizationSize)
                setOrganizationType(response.data.company.organizationType)
                setLogoPreview(response.data.company.logo)
                setTagline(response.data.company.tagLine)
                setCompanyLocation(response.data.company.location)
                setLogo(response.data.company.logo)
                setShowForm(false);
                
        } catch (error) {
            console.error('Error updating company:', error);
            toast.error("Error updating company" );
            
            
        } finally {
            setIsUpdating(false);
        }
    }
    useEffect(()=>{
        if(!companyInfo)
     fetchCompanyInfo();
     console.log("companyInfo",companyInfo)
    },[companyInfo]);
    if(errorFetchCompanyInfo){
        return(
            <div className=" bg-[#f4f2ee] min-h-screen  items-center flex flex-col   w-full rounded-lg shadow-lg p-4 ">
                <Header notifications={notifications} />
                <h1 className="mt-30 text-2xl  ">Page not found</h1>
            </div>
        )
    }

    return (
        <div className="   bg-[#f4f2ee] min-h-screen  items-center flex flex-col">
            
            <Header notifications={notifications} />
            {showForm ? 
                (<div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50 "
                onClick={() => setShowForm(false)} 
                >
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto  "
                    onClick={(e) => e.stopPropagation()} 
                >
                    <CompanyForm 
                        errors={errors}
                        companyName={companyName} setCompanyName={setCompanyName}
                        tagline={tagline} setTagline={setTagline}
                        industry={industry} setIndustry={setIndustry}
                        organizationType={organizationType} setOrganizationType={setOrganizationType}
                        organizationSize={organizationSize} setOrganizationSize={setOrganizationSize}
                        website={website} setWebsite={setWebsite}
                        checkbox={checkbox} setCheckbox={setCheckbox}
                        companyAddress={companyAddress} setCompanyAddress={setCompanyAddress}
                        logo={logo} setLogo={setLogo}
                        logoPreview={logoPreview} setLogoPreview={setLogoPreview}
                    />
                     <Toaster position="top-center" />
                    <div className="flex justify-end gap-4 mt-4">
                        <button 
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={handleUpdatePage}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>)
            :(companyInfo && 
            (<div className="lg:w-1/2 lg:h-3/4 md:w-3/4 max-[430px]:w-full ">
                <div className="bg-white rounded-lg shadow-lg mt-16 relative"> 
                    <img src="/Images/card-bg.svg"  className="w-full h-30 rounded-t-lg" />
                    <div className="flex flex-column justify-between">
                        <img src={ companyInfo.logo ? companyInfo.logo : "/Images/CompanyLogo.png"  }  className="w-28 h-28 -mt-10 ml-5  " />
                        <button className="rounded-full  hover:bg-gray-100 m-4 p-4" 
                        onClick={()=>{setShowForm(true)}}>
                        < MdModeEdit size=" 24"/>
                        </button>
                    </div>

                    

                    <div className="px-5 pt-5">
                        <h1 className="text-2xl">{companyInfo.name}</h1>
                        <div className="flex gap-2">
                            <p className="text-gray-500 text-sm">{companyInfo.industry}</p>
                            <p className="text-gray-500 text-sm">{companyInfo.location}</p>
                            <p className="text-gray-500 text-sm">{companyInfo.followersCount} followers</p>
                            <p className="text-gray-500 text-sm">{companyInfo.organizationSize} employees</p>
                        </div>
                        <div className="flex gap-4 max-[430px]:flex-col max-[430px]:gap-0">
                            <button className="    mt-4 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold py-2 px-8 rounded-full hover:bg-[#004182]" onClick={()=>{handleClickCreateButton()}}>
                                <FaPlus className="w-4 h-4"  />
                                Post job 
                            </button> 
                            <button className="  mt-4 flex items-center justify-center gap-2 bg-white text-gray-500  border-2 font-semibold py-2 px-8 rounded-full hover:bg-gray-200 "  onClick={()=>{navigate(`/company/${companyId}/`)}}>
                                <TiEye className="size-6"  />
                                View as a member
                            </button>
                        </div>
                    </div>
                    <hr className="border-gray-300 my-2" />
                    <InlineTabs activeTab={activeTab} Tabs={Tabs} handleTabClick={handleTabClick} />  
                </div>
                <div className="mt-4">
                   <Outlet context={{companyInfo}}/>
                </div>
            </div>)
            )
        }
        </div>
    )
}
export default CompanyProfileAdminViewPage;