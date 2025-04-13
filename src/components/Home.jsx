import Leftside from "./Leftside";
import Main from "./Main";
import Rightside from "./Rightside";
import Header from "./UpperNavBar";
import { useEffect } from "react";
import axios from "axios";

const Home = () => {
  document.title = "Feed | LinkedIn";
  useEffect(() => {
    const fetchUserEducation = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/education",
          { withCredentials: true }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user education:", error);
      }
    };
    fetchUserEducation();
  }, []);

  return (
    <div className="w-screen bg-[#f5f5f5]">
      {/* Navbar at the top */}
      <Header />

      {/* Content grid layout */}
      <div className="pt-[52px] grid grid-cols-[1fr_2fr_1fr] max-w-[1400px] mx-auto gap-x-6 gap-y-6 w-full">
        <Leftside />
        <Main />
        <Rightside />
      </div>
    </div>
  );
};

export default Home;
