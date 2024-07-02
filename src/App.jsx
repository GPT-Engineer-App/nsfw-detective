import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import SidebarLayout from "./components/layouts/Sidebar.jsx";

function App() {
  return (
    <Router>
      <SidebarLayout>
        <Routes>
          <Route exact path="/" element={<Index />} />
        </Routes>
      </SidebarLayout>
    </Router>
  );
}

export default App;
