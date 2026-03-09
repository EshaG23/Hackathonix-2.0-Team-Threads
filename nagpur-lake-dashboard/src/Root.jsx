import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import App from "./App"
import LandingPage from "./components/LandingPage"
import Contact from "./components/Contact"
import Partners from "./components/Partners"
import CommunityDrivePage from "./pages/CommunityDrivePage"

export default function Root() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<App />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/community-drives" element={<CommunityDrivePage />} />
            </Routes>
        </Router>
    )
}
