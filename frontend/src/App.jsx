import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// Import your page components
// Make sure to create these files with a .jsx extension inside src/components/
import GroupRegistration from './components/GroupRegistration';
import SupervisorLogin from './components/SupervisorLogin';
import SupervisorDashboard from './components/SupervisorDashboard';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto p-4">
          <nav className="bg-blue-600 text-white p-4 rounded-md shadow-lg mb-8">
            <div className="container mx-auto flex justify-between items-center">
              <Link to="/" className="font-bold text-xl hover:text-blue-200 transition-colors">Project Allocator</Link>
              <div className="flex items-center space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">Register Group</Link>
                <Link to="/supervisor/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">Supervisor Login</Link>
              </div>
            </div>
          </nav>

          <main className="bg-white p-6 rounded-md shadow-lg">
            <Routes>
              <Route path="/" element={<GroupRegistration />} />
              <Route path="/supervisor/login" element={<SupervisorLogin />} />
              <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
