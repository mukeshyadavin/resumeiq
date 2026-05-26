import { useState } from 'react';
import api from '../utils/api';

export default function Analyze() {
  const [jobDesc, setJobDesc]   = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const resume_id = localStorage.getItem('resume_id');

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) return setError('Please enter a job description');
    if (!resume_id)      return setError('Please upload a resume first');

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await api.post('/analyze', {
        resume_id: parseInt(resume_id),
        job_description: jobDesc,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Analyze Your Resume 🤖
        </h1>
        <p className="text-gray-500 mb-6">
          Paste a job description and we'll score your match instantly.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Job Description Input */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            rows={8}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 mb-6"
        >
          {loading ? '🤖 Analyzing with AI... (may take 10s)' : '🚀 Analyze My Resume'}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Score */}
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <p className="text-gray-500 text-sm mb-1">Match Score</p>
              <p className={`text-6xl font-bold ${
                result.match_score >= 70 ? 'text-green-500' :
                result.match_score >= 40 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {result.match_score}%
              </p>
              <p className="text-gray-600 text-sm mt-3">{result.summary}</p>
            </div>

            {/* Matched Skills */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                ✅ Matched Skills ({result.matched_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.map((skill, i) => (
                  <span key={i}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                ❌ Missing Skills ({result.missing_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.map((skill, i) => (
                  <span key={i}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}