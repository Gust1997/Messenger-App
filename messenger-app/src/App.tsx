import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import MessagesPage from "./pages/MessagesPage";

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/chat" element={<MessagesPage />} />
    </Routes>
  </BrowserRouter>)
  ;
}

export default App;
