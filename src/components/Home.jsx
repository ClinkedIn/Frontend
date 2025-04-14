import Leftside from "./Leftside";
import Main from "./Main";
import Rightside from "./Rightside";
import Header from "./UpperNavBar";

const Home = () => {
  document.title = "Feed | LinkedIn";

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
