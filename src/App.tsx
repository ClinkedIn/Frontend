import { useRoutes } from "react-router-dom";
import routes from "./routes";
import { SignupProvider } from "./context/signupcontext";

function App() {
  const routing = useRoutes(routes);

  return (
    <SignupProvider>
      <div>{routing}</div>
    </SignupProvider>
  );
}

export default App;
