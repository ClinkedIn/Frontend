import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { SignupProvider } from "./context/SignUpContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const routing = useRoutes(routes);

  return (
    <SignupProvider>
      <AuthProvider>
      <div>{routing}</div>
      </AuthProvider>
    </SignupProvider>
  );
}

export default App;
