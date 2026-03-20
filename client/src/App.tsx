import { Routes, Route } from "react-router-dom";
import ShopPage from "./pages/ShopPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShopPage/>}/>
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/shop/:category" element={<ShopPage />} />
    </Routes>
  );
}

export default App;