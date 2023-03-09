import "./App.css";
import Home from "./components/pages/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import User from "./components/pages/User/User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      {/* localhost:3000 */}
        <Route path="/" element={<Home />} />
        <Route path="/user/:login" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
