import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import SidebarLayout from "./components/layouts/Sidebar.jsx";
import GooglePhotos from "./pages/GooglePhotos.jsx";
import GoogleDrive from "./pages/GoogleDrive.jsx"; // New import
import Oauth2Callback from "./pages/Oauth2Callback.jsx";

function App() {
  return (
    <Router>
      <SidebarLayout>
        <Routes>
          <Route exact path="/" element={<Index />} />
        <Route path="/google-photos" element={<GooglePhotos />} />
        <Route path="/google-drive" element={<GoogleDrive />} /> {/* New Route */}
        <Route path="/oauth2callback" element={<Oauth2Callback />} />
        </Routes>
      </SidebarLayout>
    </Router>
  );
}

export default App;
