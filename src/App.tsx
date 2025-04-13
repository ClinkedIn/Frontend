import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { SignupProvider } from "./context/SignUpContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
function App() {
  const routing = useRoutes(routes);

  return (
    <SignupProvider>
      <AuthProvider>
        <div>
          {routing}
          <Toaster
            position="top-center" 
            reverseOrder={false} 
          />
        </div>
      </AuthProvider>
    </SignupProvider>
  );
}

export default App;