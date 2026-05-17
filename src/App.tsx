import { BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <LoginPage />
      </div>
    </BrowserRouter>
  );
}

export default App;
