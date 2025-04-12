import { FaPlus } from "react-icons/fa6";
import { Outlet, useNavigate,useParams } from "react-router-dom";
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


const CompanyProfileAdminViewPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const {companyId, section = "Feed"} = useParams();
    const [activeTab, setActiveTab] = useState(section);
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
    const [errors, setErrors] = useState({ });
    const [notifications, setNotifications] = useState([]);
    const Tabs =["Feed","Activity","Analytics"];
    const testLogin = async () => {
        try {
          const response = await axios.post('http://localhost:3000/user/login', {
            email: "Porter.Hodkiewicz@hotmail.com",
            password: "Aa12345678"
          },{
            withCredentials:true
          }
          
        );
    
          console.log("Login Response:", response.data);
        } catch (error) {
          if (error.response) {
      
            console.error("Login Error - Server Response:", error.response.data);
          } else if (error.request) {
            // Request made but no response received
            console.error("Login Error - No Response:", error.request);
          } else {
            // Something else happened
            console.error("Login Error:", error.message);
          }
        }
      };
     /**
       * Fetches current user profile data
       * @async
       * @function
       */
      const fetchUser = async () => {
        try {
          const response = await axios.get("http://localhost:3000/user/me", {
        
            withCredentials:true
          });
      
          setUser(response.data);
          console.log("User data:", response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

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
    
    const handleModifyCoverPicture=() =>{
        console.log("ModifyCoverPicture ")
    }

    const fetchCompanyInfo=async()=>{
        try {
            const response = await axios.get(
                `http://localhost:3000/companies/${companyId}`
            );
            setCompanyInfo(response.data); 
            setCompanyName(response.data.name)
            setCompanyAddress(response.data.address)
            setWebsite(response.data.website)
            setIndustry(response.data.industry)
            setOrganizationSize(response.data.organizationSize)
            setOrganizationType(response.data.organizationType)
            setLogoPreview(response.data.logo)
            setTagline(response.data.tagLine)
            
        } catch (error) {
            console.error("Error fetching company info:", error);
         }
    }
    useEffect(() => {
        const loginAndFetchData = async () => {
          await testLogin(); // Ensure login is completed first
          fetchUser(); 
        };
      
        loginAndFetchData();
      }, []);
    const handleUpdatePage =async()=>{
       
        if(isValid()){
            
            console.log("Page updated")
            const company ={
                userId: user.user._id,
                name: companyName,
                address:companyAddress,
                website: website,
                industry: industry,
                organizationSize: organizationSize,
                organizationType: organizationType,
                logo: logoPreview,
                tagLine: tagline
            }
            const response = await putRequest(`http://localhost:3000/companies/${companyId}`,company);
            console.log(response)
            setShowForm(false)

        }

    }
    useEffect(()=>{
        if(!companyInfo) fetchCompanyInfo();
    },[]);

    return (
        <div className="   justify-center bg-[#f4f2ee] min-h-screen  items-center flex flex-col">
            
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
                        logoPreview={logoPreview} setLogoPreview={setLogoPreview}
                    />
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
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>)
            :(companyInfo && 
            (<div className="lg:w-1/2 lg:h-3/4 md:w-3/4 max-[430px]:w-full ">
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
                        <img src={ companyInfo.logo ? companyInfo.logo  :"/Images/building-icon.png"} alt="profile" className="w-28 h-28 -mt-10 ml-5  " />
                        <button className="rounded-full  hover:bg-gray-100 m-4 p-4" 
                        onClick={()=>{setShowForm(true)}}>
                        < MdModeEdit size=" 24"/>
                        </button>
                    </div>

                    

                    <div className="px-5 pt-5">
                        <h1 className="text-2xl">{companyInfo.name}</h1>
                        <div className="flex gap-2">
                            <p className="text-gray-500 text-sm">{companyInfo.industry}</p>
                            <p className="text-gray-500 text-sm">{companyInfo.address}</p>
                            <p className="text-gray-500 text-sm">{companyInfo.followers.length} followers</p>
                            <p className="text-gray-500 text-sm">{companyInfo.organizationSize} emplyees</p>
                        </div>
                        <div className="flex gap-4 max-[430px]:flex-col max-[430px]:gap-0">
                            <button className="    mt-4 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold py-2 px-8 rounded-full hover:bg-[#004182]" onClick={()=>{handleClickCreateButton()}}>
                                <FaPlus className="w-4 h-4"  />
                                Create 
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