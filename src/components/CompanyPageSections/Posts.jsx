

import { useOutletContext } from 'react-router-dom';
import { useEffect,useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
const CompanyPostsPage = ()=> {
    const {companyInfo}  = useOutletContext();
    const [posts, setPosts] = useState([]);
    const [loadingPoasts, setLoadingPosts] = useState(true);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/companies/${companyInfo.id}/post`,{
                    withCredentials: true,
                });
                setPosts(response.data.posts);
                console.log('Posts data:', response.data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchPosts();
    }, [companyInfo?.id]);

   if(loadingPoasts){
    return(
        <div className="mt-4 bg-white justify-center flex   w-full rounded-lg shadow-lg p-4 ">
            <h1 className="text-2xl  ">Loading Posts....</h1>
        </div>
    )
   }
    if(posts.length===0){
     return(
          <div className="mt-4 bg-white flex justify-center   w-full rounded-lg shadow-lg p-4 ">
                <h1 className="text-2xl  ">No Posts Found</h1>
          </div>
     )
    }

   return(
    <div className="mt-4 bg-white   w-full rounded-lg shadow-lg p-4 ">

    </div>
   )



}
export default CompanyPostsPage;