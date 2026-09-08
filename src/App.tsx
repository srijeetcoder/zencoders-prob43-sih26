import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import ForgetPassword from "./pages/ForgetPW.tsx"
import Homepage from "./pages/Homepage.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
