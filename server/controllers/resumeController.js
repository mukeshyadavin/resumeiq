require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const pdfParse = require('pdf-parse');
const db = require('../db');
const fs = require('fs');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'No file uploaded' });

    // Read uploaded PDF file
    const dataBuffer = fs.readFileSync(req.file.path);

    // Parse PDF text
    const pdfData = await pdfParse(dataBuffer);
    const parsedText = pdfData.text;

    // Save to MySQL
    const [result] = await db.query(
      'INSERT INTO resumes (user_id, file_name, parsed_text) VALUES (?, ?, ?)',
      [req.user.id, req.file.originalname, parsedText]
    );

    // Delete file from server after parsing (we only need the text)
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resume_id: result.insertId,
      file_name: req.file.originalname,
      preview: parsedText.substring(0, 300) + '...'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to parse resume' });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const [resumes] = await db.query(
      'SELECT id, file_name, uploaded_at FROM resumes WHERE user_id = ? ORDER BY uploaded_at DESC',
      [req.user.id]
    );
    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};