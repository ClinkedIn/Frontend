import Layout from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import UpdatePasswordForm from "./components/UpdatePasswordForm/UpdatePasswordForm";
import UpdateUserNameForm from "./components/UpdateUserNameForm/UpdateUserNameForm";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPasswordForm from "./components/ForgotPasswordForm/ForgotPasswordForm.jsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/update-password-form" element={<UpdatePasswordForm />} />
        <Route path="/update-username-form" element={<UpdateUserNameForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      </Routes>
    </Layout>
  );
}

export default App;
