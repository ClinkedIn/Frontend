
import { FaPlus,FaUpload } from "react-icons/fa6";


const CompanyForm = ({ errors,companyName, setCompanyName, tagline, setTagline, industry, setIndustry, organizationType, setOrganizationType, organizationSize, setOrganizationSize, website, setWebsite, checkbox, setCheckbox, companyAddress, setCompanyAddress, logoPreview, setLogoPreview,showTerms }) =>{


    return(
        <div>
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
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
            </div>
            
            <div>
                <label htmlFor="Address" className="block text-sm font-medium text-gray-700">
                    Address*
                </label>
                <input
                    type="text"
                    id="Address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    placeholder="Add your company address"
                />
                {errors.companyAddress && <p className="text-red-500 text-sm mt-1">{errors.companyAddress}</p>}
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
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
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
                />
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
            </div>
            
            <div>
                <label htmlFor="organizationSize" className="block text-sm font-medium text-gray-700">Organization Size*</label>
                <select
                    id="organizationSize"
                    value={organizationSize}
                    onChange={(e) =>setOrganizationSize(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                >
                        <option value="">Select size</option>
                        <option value="0-1">0-1 employees</option>
                        <option value="2-10">2-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1001-5000">1001-5000 employees</option>
                        <option value="5001-10000">5001-10,000 employees</option>
                        <option value="10000+">10,000+ employees</option>
                </select>
                {errors.organizationSize && <p className="text-red-500 text-sm mt-1">{errors.organizationSize}</p>}
            </div>
            
            <div>
                <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">Organization Type*</label>
                <select
                    id="organizationType"
                    value={organizationType}
                    onChange={(e) =>setOrganizationType(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                >
                        <option value="">Select type</option>
                        <option value="Public company">Public company</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Government agency">Government agency</option>
                        <option value="Non-profit">Non-profit</option>
                        <option value="Sole proprietorship">Sole proprietorship</option>
                        <option value="Privately held">Privately held</option>
                        <option value="Partnership">Partnership</option>
                </select>
                {errors.organizationType && <p className="text-red-500 text-sm mt-1">{errors.organizationType}</p>}
            </div>
            <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                    Logo
                </label>
                <div className="flex items-center gap-4 mt-1">
                    <label
                        htmlFor="logoUpload"
                        className="cursor-pointer flex items-center justify-center px-4 py-2 bg-[#0A66C2] text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                    >
                        <FaUpload className="w-5 h-5 mr-2" />
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
                            // setLogo(file);
                            }
                        }}
                    />
                    <button type="reset"className="cursor-pointer flex items-center justify-center px-4 py-2 bg-[#0A66C2] text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 " onClick={()=>{setLogoPreview(null)}}>reset </button>

                    <img src={logoPreview || "/Images/CompanyLogo.png"} alt="Logo Preview" className="w-32 h-32  " />

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
            {showTerms &&
            <div className="flex  gap-2">
                <input type="checkbox" data-testid="checkbox" checked={checkbox} onChange={(e) => setCheckbox(e.target.checked)} id="checkbox" className=" size-12 rounded-md border-gray-300  focus:border-green-500 focus:ring-green-500 " />
                <p >I verify that I am an authorized representative of this organization and have the right to act on its behalf in the creation and management of this page. The organization and I agree to the additional terms for Pages.</p> 
            </div>}  
            {errors.checkbox && <p className="text-red-500 text-sm ">{errors.checkbox}</p>} 
        </form>   
        </div>    
    )





}

export default CompanyForm