import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import ProfilePage from './pages/ProfilePage';

function App() {
    return (
        <Router>
            <div className="min-h-screen">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/assess" element={<AssessmentPage />} />
                    <Route path="/profile/:shareId" element={<ProfilePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
