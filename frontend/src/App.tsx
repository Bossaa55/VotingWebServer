import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { VotingPage } from "./pages/VotingPage";
import { VoteResultPage } from "./pages/VoteResultPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminVoteCount } from "./pages/AdminVoteCount";
import { AdminPage } from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/voteresult" element={<VoteResultPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/votecount" element={<AdminVoteCount />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
