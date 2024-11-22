
import Home from './Home';
import App from './App';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';    
function MainApp() {
  return (
    <Router>
        
            <Link to="/login">
              <button className="btn">Login</button>
            </Link>

    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<App />} />
      {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default MainApp
