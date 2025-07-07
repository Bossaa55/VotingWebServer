import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { VotingPage } from "./pages/VotingPage";
import { VoteResultPage } from "./pages/VoteResultPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminVoteCount } from "./pages/admin/AdminVoteCount";
import { AdminPage } from "./pages/admin/AdminPage";
import { AdminManagePage } from "./pages/admin/manage/AdminManagePage";
import { AdminManageCreatePage } from "./pages/admin/manage/AdminManageCreatePage";
import { AdminManageEditPage } from "./pages/admin/manage/AdminManageEditPage";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/voteresult" element={<VoteResultPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/votecount" element={<AdminVoteCount />} />
            <Route path="/admin/manage" element={<AdminManagePage />} />
            <Route path="/admin/manage/create" element={<AdminManageCreatePage />} />
            <Route path="/admin/manage/edit" element={<AdminManageEditPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
