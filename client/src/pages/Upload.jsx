import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Upload() {
  const [file, setFile]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a PDF file');

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Save resume_id and go to analyze page
      localStorage.setItem('resume_id', data.resume_id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Your Resume 📄
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          PDF format only. We'll parse it automatically.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
            <input
              type="file" accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden" id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-gray-600 text-sm">
                {file ? file.name : 'Click to select PDF'}
              </p>
            </label>
          </div>

          <button
            type="submit" disabled={loading || !file}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </form>
      </div>
    </div>
  );
}