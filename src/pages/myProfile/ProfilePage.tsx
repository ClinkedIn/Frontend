import React, { useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import ProfileHeader from "../../components/myProfile/ProfileHeader";
import ExperienceSection from "../../components/myProfile/ExperienceSection";
import EducationSection from "../../components/myProfile/EducationSection";
import SkillsSection from "../../components/myProfile/SkillsSection";
import ResumeSection from "../../components/myProfile/ResumeSection";
const LinkedInProfile: React.FC = () => {
  const [showExperienceForm, setShowExperienceForm] = useState(false);

  return (
    <div className="bg-[#F4F2EE] min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <ProfileHeader />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4 relative">
            <div className="mt-4">
              <ExperienceSection
                showExperienceForm={showExperienceForm}
                setShowExperienceForm={setShowExperienceForm}
              />
            </div>
            <div className="mt-4">
              <EducationSection />
            </div>
            <div className="mt-4">
              <SkillsSection />
            </div>
            <div className="mt-4">
              <ResumeSection />
            </div>
          </div>

          <div className="w-full lg:w-1/4 space-y-4 mt-4 lg:mt-6"></div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInProfile;
