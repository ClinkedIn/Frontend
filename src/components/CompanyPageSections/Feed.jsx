import { useOutletContext } from "react-router-dom";


const CompanyFeedPage = () => {
  const {companyInfo}  = useOutletContext();
  return(


    <div className="mt-4 bg-white   w-full rounded-lg shadow-lg p-4 ">
        <h1 className="text-2xl ">Overview</h1>
        {companyInfo.tagLine !=="null" &&<h2 className="text-gray-500 ">{companyInfo.tagLine}</h2>}
        <h2 className="font-semibold ">Website</h2>
        <a href={companyInfo.website} className="text-[#0A66C2] hover:underline" link={companyInfo.website} target="_blank" rel="noopener noreferrer">
        {companyInfo.website}
        </a>
        <h2 className="font-semibold ">Industry</h2>
        <h2 className="text-gray-500 ">{companyInfo.industry}</h2>
        <h2 className="font-semibold ">Company size</h2>
        <h2 className="text-gray-500 ">{companyInfo.organizationSize}</h2>
    </div>
  )

}
export default CompanyFeedPage;