import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/analyze')
      .then(({ data }) => setAnalyses(data.analyses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading history...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analysis History 📋</h1>
        <p className="text-gray-500 mb-6">All your past resume analyses.</p>

        {analyses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            No analyses yet. <a href="/analyze" className="text-blue-600">Analyze your resume!</a>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((a) => (
              <div key={a.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(a.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {JSON.parse(a.matched_skills || '[]').slice(0, 4).map((s, i) => (
                        <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${
                      a.match_score >= 70 ? 'text-green-500' :
                      a.match_score >= 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {a.match_score}%
                    </p>
                    <p className="text-xs text-gray-400 mt-1">match score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}