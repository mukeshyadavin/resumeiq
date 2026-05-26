import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-xl shadow-md p-8 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-500">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => navigate('/upload')}
            className="bg-blue-600 text-white p-6 rounded-xl font-semibold hover:bg-blue-700 transition text-left"
          >
            <div className="text-3xl mb-2">📄</div>
            <div>Upload Resume</div>
            <div className="text-blue-200 text-sm mt-1">Upload a new PDF</div>
          </button>

          <button
            onClick={() => navigate('/analyze')}
            className="bg-purple-600 text-white p-6 rounded-xl font-semibold hover:bg-purple-700 transition text-left"
          >
            <div className="text-3xl mb-2">🤖</div>
            <div>Analyze Resume</div>
            <div className="text-purple-200 text-sm mt-1">Match against a JD</div>
          </button>

          {/* History button — full width */}
          <button
            onClick={() => navigate('/history')}
            className="bg-green-600 text-white p-6 rounded-xl font-semibold hover:bg-green-700 transition text-left col-span-2"
          >
            <div className="text-3xl mb-2">📋</div>
            <div>View History</div>
            <div className="text-green-200 text-sm mt-1">See all past analyses</div>
          </button>

        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}