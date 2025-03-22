import Button from "../../components/Button";
import Header from "../../components/UpperNavBar"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CreateCompanyPage = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [tagline, setTagline] = useState("");
    const [industry, setIndustry] = useState("");
    const [organizationType, setOrganizationType] = useState("");
    const [organizationSize, setOrganizationSize] = useState("");
    const [website, setWebsite] = useState("");
    const [chechbox, setCheckbox] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [companyUrl, setCompanyUrl] = useState("");   
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
   
    const createPage = () => {
        console.log(logo);
    }


    return (
        <div className="bg-[#f4f2ee] min-h-screen">
        <Header />
        <section className="w-full bg-white shadow-md rounded-lg p-6 px-4 pt-20 md:px-40">
                    <button 
                        className="flex items-center text-blue-600 hover:text-gray-900 font-medium hover:bg-gray-100 p-2 rounded-lg"
                        onClick={() => navigate("/HomePage")}
                    >
                        <img src="/Images/right-icon.svg" alt="Back" width="24" height="24" className="mr-2" />
                        Back
                    </button>
                    <div className="mt-6 flex items-center space-x-4">
                        <img src="/Images/right-icon.svg" alt="Icon" width="24" height="24" />
                        <h1 className="text-xl font-semibold text-gray-800">
                            Let's get started with a few details about your company
                        </h1>
                    </div>
        </section>
        <div className=" w-full px-4 pt-20 md:px-0 flex flex-col lg:flex-row justify-center gap-4">

            <div className=" lg:w-[40%] md:px-4">
                <form className="mt-8 bg-white   shadow-md rounded-lg p-6 grid gap-6  ">
                    <p className="text-sm text-gray-500">* Indicates required field</p>
                    
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Name*</label>
                        <input
                            type="text"
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            placeholder="Add your organization's name"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="lockedInAddress" className="block text-sm font-medium text-gray-700">
                            lockedin.com/company/*
                        </label>
                        <input
                            type="text"
                            id="lockedInAddress"
                            value={companyUrl}
                            onChange={(e) => setCompanyUrl(e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            placeholder="Add your unique Lockedin address"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                        <input
                            type="url"
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            placeholder="Begin with http://, https://, or www."
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry*</label>
                        <input
                            type="text"
                            id="industry"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            placeholder="e.g., Information Services"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="organizationSize" className="block text-sm font-medium text-gray-700">Organization Size*</label>
                        <select
                            id="organizationSize"
                            value={organizationSize}
                            onChange={(e) => setOrganizationSize(e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            required
                        >
                            <option>Select size</option>
                            <option>0-1 employees</option>
                            <option>2-10 employees</option>
                            <option>11-50 employees</option>
                            <option>51-200 employees</option>
                            <option>201-500 employees</option>
                            <option>501-1000 employees</option>
                            <option>1001-5000 employees</option>
                            <option>5001-10,000 employees</option>
                            <option>10,000+ employees</option>
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">Organization Type*</label>
                        <select
                            id="organizationType"
                            value={organizationType}
                            onChange={(e) => setOrganizationType(e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            required
                        >
                            <option>Select type</option>
                            <option>Public company</option>
                            <option>Self-employed</option>
                            <option>Government agency</option>
                            <option>Non-profit</option>
                            <option>Sole proprietorship</option>
                            <option>Privately held</option>
                            <option>Partnership</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                            Logo
                        </label>
                        <div className="flex items-center gap-4 mt-1">
                            <label
                                htmlFor="logoUpload"
                                className="cursor-pointer flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                            >
                                <img src="/Images/upload-icon.svg" alt="Upload" className="w-5 h-5 mr-2" />
                                Upload Logo
                            </label>
                            <input
                                type="file"
                                id="logoUpload"
                                className="hidden"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        const file = e.target.files[0];
                                        setLogoPreview(URL.createObjectURL(file));
                                        setLogo(file);
                                    }
                                }}
                            />
                            {logoPreview && (
                                <img src={logoPreview} alt="Logo Preview" className="w-32 h-32  " />
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            300 x 300px recommended. JPG, JPEG, and PNG supported.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">Tagline</label>
                        <textarea
                            id="tagline"
                            rows={4}
                            value={tagline}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                            placeholder="ex: An information services firm helping small businesses succeed"
                            onChange={(e) => {
                                if (e.target.value.length <= 120) {
                                    setTagline(e.target.value);
                                }
                            }}
                        ></textarea>
                        <p className="text-sm text-gray-500">Use your tagline to briefly describe what your organization does. This can be changed later. {tagline.length}/{120} </p>
                    </div>
                    <div>
                        <input type="checkbox" value={chechbox} onChange={(e)=>{setCheckbox(e.target.value)}} id="checkbox" className="mt-5 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" />
                        <p>I verify that I am an authorized representative of this organization and have the right to act on its behalf in the creation and management of this page. The organization and I agree to the additional terms for Pages.</p>
                    </div>   
                </form>
                <Button className="mt-6 " onClick={()=>{createPage()}}>Create Page </Button>
            </div>
            <aside className="md:px-4 md:w-[60%]  lg:w-[40%] h-fit rounded-lg lg:sticky lg:top-24">
                    <section className="mt-8 shadow-lg rounded-lg flex flex-col">
                        <div className="bg-white w-full p-4 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-800">Page Preview</h2>
                        </div>
                        <div className="bg-[#EAE6DF] w-full p-8 rounded-lg">
                            <div className="bg-white rounded-lg overflow-hidden shadow">
                                <div className="p-6 flex ">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Company Logo" className="w-20 h-20 rounded-lg" />
                                    ) : (
                                        <img src="/Images/linkedin.png" alt="Default Logo" className="w-20 h-20" />
                                    )}
                                </div>
                                <div className="p-6 ">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        {companyName || "Company Name"}
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {tagline || "Tagline"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {industry || "Industry"}
                                    </p>
                                    <button className="mt-4 flex items-center justify-center gap-2 bg-[#0073b1] text-white font-semibold py-2 px-5 rounded-full shadow-md hover:bg-[#005582] transition duration-200">
                                        <img src="/Images/plus-icon.svg" alt="Follow" className="w-5 h-5" />
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
