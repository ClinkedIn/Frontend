import { RouteObject } from "react-router-dom";
import React from "react";
import Home from "../src/pages/home/HomePage";
import Login from "../src/pages/Login/LoginPage";
import SignUp from "../src/pages/signup/SignUpPage";
import TestPage from "./pages/Test/TestPage.jsx";
import PasswordResetUsingMail from "../src/pages/PasswordResetUsingMail/PassWordResetUsingMail";
import VerifyEmail from "../src/pages/signup/VerifyEmail";
import UpdatePasswordForm from "./components/authentication/Reset/UpdatePasswordForm";
import UpdateUserNameForm from "./components/authentication/Reset/UpdateUserNameForm";
import ForgotPasswordForm from "./components/authentication/Reset/ForgotPasswordForm";
import Notification from "./pages/notifications/Notifications";
import Jobs from "./pages/jobs/Jobs";
import CreateCompanyPage from "./pages/CompanyPages/CreateCompanyPage";
import CompanyProfilePage from "./pages/CompanyPages/CompanyProfile.js";




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
    path: "/",
    element: React.createElement(Home),
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
    path:"/company/setup/new",
    element: React.createElement(CreateCompanyPage),
  },
  {
    path:"/company/{companyId}",
    element: React.createElement(CompanyProfilePage),
  }
];



export default routes;
