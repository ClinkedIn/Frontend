import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { SignupProvider } from "./context/SignUpContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast"; // Import Toaster from react-hot-toast

function App() {
  const routing = useRoutes(routes);

  return (
    <SignupProvider>
      <AuthProvider>
        <div>
          {routing}
          {/* Add the Toaster component here */}
          <Toaster
            position="top-center" // Adjust the position as needed
            reverseOrder={false} // Display toasts in the order they appear
          />
        </div>
      </AuthProvider>
    </SignupProvider>
  );
}

export default App;