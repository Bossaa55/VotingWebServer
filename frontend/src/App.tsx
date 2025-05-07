import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { VotingPage } from "./pages/VotingPage";
import { VoteResultPage } from "./pages/VoteResultPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/voteresult" element={<VoteResultPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
