import { Navigate, RouteObject } from "react-router-dom";
import React from "react";
import Home from "../src/pages/home/HomePage";
import Login from "./components/authentication/Login/LoginPage";
import SignUp from "./components/authentication/SignUp/SignUpPage";
import TestPage from "./pages/Test/TestPage.jsx";
import PasswordResetUsingMail from "../src/pages/PasswordResetUsingMail/PassWordResetUsingMail";
import VerifyEmail from "../src/pages/signup/VerifyEmail";
import UpdatePasswordForm from "./components/authentication/Reset/UpdatePasswordForm";
import UpdateUserNameForm from "./components/authentication/Reset/UpdateUserNameForm";
import ForgotPasswordForm from "./components/authentication/Reset/ForgotPassword/ForgotPasswordForm";
import Notification from "./pages/notifications/Notifications";
import Jobs from "./pages/jobs/Jobs";
import LandingPage from "./pages/LandingPage/LandingPage.tsx";
import ReportedPostsAdmin from "./components/AdminPanel/ReportedPostsAdmin";
import NotificationPost from "./components/Notification/NotificationPost.jsx";
import ProfilePage from "./pages/myProfile/ProfilePage";
import CreateCompanyPage from "./pages/CompanyPages/CreateCompanyPage";
import CompanyProfileMemberViewPage from "./pages/CompanyPages/CompanyProfileMemberView";
import CompanyProfileAdminViewPage from "./pages/CompanyPages/CompanyProfileAdminView";
import CompanyHomePage from "./components/CompanyPageSections/Home"
import CompanyPostsPage from "./components/CompanyPageSections/Posts.jsx"
import CompanyJobsPage from "./components/CompanyPageSections/Jobs.jsx"
import SettingsPage from "./components/Settings/Settings.tsx";
import MyJobs from "./pages/jobs/MyJobs.jsx";
import MessagingPage from "./pages/messaging/Messaging.jsx";
import JobBoardPage from "./pages/jobs/JobBoardPage.jsx";
import JobListing from "./components/AdminPanel/JobListing";
import Analytics from "./components/AdminPanel/Analytics";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import UserProfileViewPage from "./pages/myProfile/OtherProfile/UserProfileViewPage";
import HirePage from "./pages/jobs/HirePage.jsx";
import JobDescriptionPage from "./pages/jobs/JobDescriptionPage.jsx";
import JobSettingsPage from "./pages/jobs/JobSettingsPage.jsx";
import Review from "./pages/jobs/Review.jsx";
import JobDetails from "./pages/jobs/JobDetails.jsx";
import ManageJob from "./pages/jobs/ManageJob.jsx";
import SubscriptionPlans from "./components/SubscriptionBasedPayment/subscriptionPlans.jsx";
import SubscriptionStatus from './components/SubscriptionBasedPayment/SubscriptionStatus';
import PaymentSuccess from './components/SubscriptionBasedPayment/PaymentSuccessHandler';
import CompanyFeedPage from "./components/CompanyPageSections/Feed";
import CompanyAnalyticsPage from "./components/CompanyPageSections/Analytics.jsx";
import CompanyManageJobsPage from "./components/CompanyPageSections/ManageJobs.jsx";
import Network from "./components/Network/network";
import InvitationManager from "./components/Network/invitations";
import Connections from "./components/Network/connections";
import BlockedUsers from "./components/Network/BlockedUsers";

// Define your routes as an array of RouteObject (compatible with React Router v6)
const routes: RouteObject[] = [
  //Add routes and their corresponding needed component page
  {
    path: "/test",
    element: React.createElement(TestPage),
  },
  {
    path: "/password-reset",
    element: React.createElement(PasswordResetUsingMail),
  },
  {
    path: "/home",
    element: React.createElement(Home),
  },
  {
    path: "/feed",
    element: React.createElement(TestPage),
  },
  {
    path: "/login",
    element: React.createElement(Login),
  },
  {
    path: "/signup",
    element: React.createElement(SignUp),
  },
  {
    path: "/verify-email",
    element: React.createElement(VerifyEmail),
  },
  {
    path: "/update-password",
    element: React.createElement(UpdatePasswordForm),
  },
  {
    path: "/update-username",
    element: React.createElement(UpdateUserNameForm),
  },
  {
    path: "/forgot-password",
    element: React.createElement(ForgotPasswordForm),
  },
  {
    path: "/notifications",
    element: React.createElement(Notification),
  },
  {
    path: "/jobs",
    element: React.createElement(Jobs),
  },
  {
    path: "/jobdescription",
    element: React.createElement(JobDescriptionPage),
  },
  {
    path: "/jobsettings",
    element: React.createElement(JobSettingsPage),
  },
  {
    path: "/jobdetails",
    element: React.createElement(JobDetails),
  },
  {
    path: "/managejob",
    element: React.createElement(ManageJob),
  },
  {
    path: "/starthiring",
    element: React.createElement(HirePage),
  }, {
    path: "/review",
    element: React.createElement(Review),
  },
  {
    path: "/myjobs",
    element: React.createElement(MyJobs),
  },
  {
    path: "/job-board",
    element: React.createElement(JobBoardPage),
  },
  {
    path: "/",
    element: React.createElement(LandingPage),
  },
  {
    path: "/network",
    element: React.createElement(Network),
  },
  {
    path: "/network/invitation-manager",
    element: React.createElement(InvitationManager),
  },
  {
    path: "/network/connections",
    element: React.createElement(Connections),
  },
  {
    path: "/network/blocked-users",
    element: React.createElement(BlockedUsers),
  },
  {
    path: "/admin",
    element: React.createElement(AdminPanel),
    children: [
      {
        path: "reported-posts", // Removed the leading "/"
        element: React.createElement(ReportedPostsAdmin),
      },
      {
        path: "job-listing", // Removed the leading "/"
        element: React.createElement(JobListing),
      },
      {
        path: "analytics", // Removed the leading "/"
        element: React.createElement(Analytics),
      },
      // You might want to add an index route as well
      {
        index: true,
        element: React.createElement("div", null, "Welcome to Admin Panel"),
      },
    ],
  },
  {
    path: "/notification-post",
    element: React.createElement(NotificationPost),
  },
  {
    path: "/profile",
    element: React.createElement(ProfilePage),
  },
  {
    path: "/company/setup/new",
    element: React.createElement(CreateCompanyPage),
  },
  {
    path: "/company/:companyId/",
    element: React.createElement(CompanyProfileMemberViewPage),
    children: [
      {
        index: true,
        element: React.createElement(Navigate, { to: "Home", replace: true }),
      }, // Default to Home
      { path: "Home", element: React.createElement(CompanyHomePage) },
      { path: "Posts", element: React.createElement(CompanyPostsPage) },
      { path: "Jobs", element: React.createElement(CompanyJobsPage) },
    ],
  },
  {
    path: "/company/:companyId/admin/",
    element: React.createElement(CompanyProfileAdminViewPage),
    children: [
      {
        index: true,
        element: React.createElement(Navigate, { to: "Feed", replace: true }),
      }, // Default to Home
      { path: "Feed", element: React.createElement(CompanyFeedPage) },
      { path: "Analytics", element: React.createElement(CompanyAnalyticsPage) },
      { path: "Jobs", element: React.createElement(CompanyManageJobsPage) },
    ],
  },
    {
    path: "/settings",
    element: React.createElement(SettingsPage),
  },
  {
    path: "/messaging",
    element: React.createElement(MessagingPage),
  }





  ,
  {
  path: "/user/:userId",
  element: React.createElement(UserProfileViewPage),
  },
  {
    path: "/Subscription-Plans",
    element: React.createElement(SubscriptionPlans),
  },
  {
    path: "/Subscription-Status",
    element: React.createElement(SubscriptionStatus),
  },
  {
    path: "/Payment-Success",
    element: React.createElement(PaymentSuccess),
  }
  
];

export default routes;
