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

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analysis History 📋</h1>
            <p className="text-gray-500">All your past resume analyses.</p>
          </div>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            No analyses yet.{' '}
            <span
              onClick={() => navigate('/analyze')}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Analyze your resume!
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((a) => {
              let matchedSkills = [];
              let missingSkills = [];
              try { matchedSkills = JSON.parse(a.matched_skills || '[]'); } catch {}
              try { missingSkills = JSON.parse(a.missing_skills || '[]'); } catch {}

              return (
                <div key={a.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-start">

                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-3">
                        {new Date(a.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>

                      {matchedSkills.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-semibold text-gray-500 mb-1">✅ Matched</p>
                          <div className="flex gap-2 flex-wrap">
                            {matchedSkills.slice(0, 4).map((s, i) => (
                              <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                                {s}
                              </span>
                            ))}
                            {matchedSkills.length > 4 && (
                              <span className="text-xs text-gray-400">+{matchedSkills.length - 4} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {missingSkills.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-1">❌ Missing</p>
                          <div className="flex gap-2 flex-wrap">
                            {missingSkills.slice(0, 3).map((s, i) => (
                              <span key={i} className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
                                {s}
                              </span>
                            ))}
                            {missingSkills.length > 3 && (
                              <span className="text-xs text-gray-400">+{missingSkills.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <p className={`text-4xl font-bold ${
                        a.match_score >= 70 ? 'text-green-500' :
                        a.match_score >= 40 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {a.match_score}%
                      </p>
                      <p className="text-xs text-gray-400 mt-1">match score</p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}