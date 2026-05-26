require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../db');
const { analyzeResume, rewriteResume, generateCoverLetter } = require('../services/claudeService');

exports.analyze = async (req, res) => {
  const { resume_id, job_description } = req.body;

  if (!resume_id || !job_description)
    return res.status(400).json({ message: 'resume_id and job_description are required' });

  try {
    // Get resume text from MySQL
    const [resumes] = await db.query(
      'SELECT parsed_text FROM resumes WHERE id = ? AND user_id = ?',
      [resume_id, req.user.id]
    );

    if (resumes.length === 0)
      return res.status(404).json({ message: 'Resume not found' });

    const resumeText = resumes[0].parsed_text;

    // Call AI for all 3 tasks in parallel
    console.log('Calling AI...');
    const [result, rewritten, coverLetter] = await Promise.all([
      analyzeResume(resumeText, job_description),
      rewriteResume(resumeText, job_description),
      generateCoverLetter(resumeText, job_description),
    ]);
    console.log('AI response received, score:', result.match_score);

    // Save everything to MySQL
    const [saved] = await db.query(
      `INSERT INTO analyses 
        (user_id, resume_id, job_description, match_score, matched_skills, missing_skills, rewritten_resume, cover_letter)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        resume_id,
        job_description,
        result.match_score,
        JSON.stringify(result.matched_skills),
        JSON.stringify(result.missing_skills),
        rewritten,
        coverLetter,
      ]
    );

    res.status(201).json({
      message:          'Analysis complete',
      analysis_id:      saved.insertId,
      match_score:      result.match_score,
      matched_skills:   result.matched_skills,
      missing_skills:   result.missing_skills,
      summary:          result.summary,
      rewritten_resume: rewritten,
      cover_letter:     coverLetter,
    });

  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ message: 'Analysis failed', error: err.message });
  }
};

exports.getAnalyses = async (req, res) => {
  try {
    const [analyses] = await db.query(
      `SELECT id, resume_id, match_score, matched_skills, missing_skills, created_at 
       FROM analyses WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ analyses });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAnalysis = async (req, res) => {
  try {
    const [analyses] = await db.query(
      'SELECT * FROM analyses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (analyses.length === 0)
      return res.status(404).json({ message: 'Analysis not found' });

    res.json({ analysis: analyses[0] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};