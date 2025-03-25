import Header from "../../components/UpperNavBar"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {IoIosArrowRoundBack} from "react-icons/io";
import { FaPlus,FaUpload } from "react-icons/fa6";
import axios from "axios";
import CompanyForm from "../../components/CompanyPageSections/CompanyPageForm";




const CreateCompanyPage = () => {
    const navigate = useNavigate();
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

    /*const handleSelectChange = (setter, field) => (e) => {
        const value = e.target.value;
        setter(value);
        setErrors((prev) => ({
            ...prev,
            [field]: value.toLowerCase().includes("select") ? "Please choose a valid option." : ""
        }));
    };*/
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
    
        if (!checkbox) {
            newErrors.checkbox = "You must agree to the additional terms.";
        } else {
            newErrors.checkbox = "";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).filter((key) => newErrors[key]).length === 0;
    };
    const createPage = async() => {
        if(isValid()){
            
            console.log("Page Created")
            const company ={
                userId: "1234",
                name: companyName,
                address:companyAddress,
                website: website,
                industry: industry,
                organizationSize: organizationSize,
                organizationType: organizationType,
                logo: logoPreview,
                tagLine: tagline
            }
            const response = await axios.post("http://localhost:5173/companies",company);
            navigate(`/company/${response.data._id}`)
            
        }

    }

    return (
        <div className="bg-[#f4f2ee] min-h-screen">
        <Header notifications={notifications} />
        <section className="w-full bg-white shadow-md rounded-lg p-6 px-4 pt-20 md:px-40">
                    <button 
                        className="flex items-center text-[#0A66C2] hover:text-gray-900 font-medium hover:bg-gray-100 p-2 rounded-lg"
                        onClick={() => navigate("/HomePage")}
                    >
                     <IoIosArrowRoundBack className="w-12 h-12 " />
                       <h1 className="text-2xl font-semibold ">
                       Back 
                       </h1>
                    </button>
                    <div className="mt-4 flex items-center gap-4">
                        <img src="/Images/building-icon.png" alt="Icon" width="50" height="50" />
                        <p className="text-xl font-semibold text-gray-800">
                            Let's get started with a few details about your company
                        </p>
                    </div>
        </section>
        <div className=" w-full px-4 pt-20 md:px-0 flex flex-col lg:flex-row justify-center gap-4">

            <div className=" lg:w-[40%] md:px-4">
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
                        showTerms={true}
                    />
                <button className="rounded-full  py-3 px-5 m-2 text-white cursor-pointer font-semibold bg-[#0A66C2] " onClick={()=>{createPage()}}>Create Page </button>
            </div>
            <aside className="md:px-4 md:w-[60%]  lg:w-[40%] h-fit rounded-lg lg:sticky lg:top-24">
                    <section className="mt-8 shadow-lg rounded-lg flex flex-col">
                        <div className="bg-white w-full p-4 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-800">Page Preview</h2>
                        </div>
                        <div className="bg-[#EAE6DF] w-full p-8 rounded-lg">
                            <div className="bg-white rounded-lg overflow-hidden shadow">
                                <div className="px-6 pt-6  flex ">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Company Logo" className="w-24 h-24 rounded-lg" />
                                    ) : (
                                        <img src="/Images/CompanyLogo.png" alt="Default Logo" className="w-24 h-24" />
                                    )}
                                </div>
                                <div className="px-6 py-3 ">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        {companyName || "Company Name"}
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {tagline || "Tagline"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {industry || "Industry"}
                                    </p>
                                    <button disabled={true} className="mt-4 flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-semibold py-2 px-5 rounded-full">
                                        <FaPlus className="w-5 h-5" />
                                        Follow
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>

        </div>
        
    </div>
    )
}
export default CreateCompanyPage;
