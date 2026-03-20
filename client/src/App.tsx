import { Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;