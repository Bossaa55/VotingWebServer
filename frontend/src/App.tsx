import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { VotingPage } from "./pages/VotingPage";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/vote" element={<VotingPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
