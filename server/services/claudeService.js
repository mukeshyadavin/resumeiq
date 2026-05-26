require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.analyzeResume = async (resumeText, jobDescription) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
  {
    role: "user",
    content: `
You are an expert HR analyst and resume evaluator.

Analyze the following resume against the job description and return a JSON response.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):

{
  "match_score": <number between 0 and 100>,
  "matched_skills": ["<list of skills found in both resume and JD>"],
  "missing_skills": ["<list of skills required in JD but missing from resume>"],
  "summary": "<2-3 sentence summary of the match>"
}
`
  }
],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const raw = completion.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

exports.rewriteResume = async (resumeText, jobDescription) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `
You are an expert resume writer.

Rewrite the following resume to better match the job description.
Keep all the real experience and facts — just reframe, reorder and rephrase to highlight relevant skills.
Make it professional, ATS-friendly, and tailored to the job.

ORIGINAL RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY the rewritten resume text. No explanation, no markdown.
        `
      }
    ],
    temperature: 0.5,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
};

exports.generateCoverLetter = async (resumeText, jobDescription) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `
You are an expert cover letter writer.

Write a professional, compelling cover letter based on the resume and job description below.
Make it personal, specific, and 3-4 paragraphs long.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY the cover letter text. No explanation, no subject line.
        `
      }
    ],
    temperature: 0.6,
    max_tokens: 1000,
  });

  return completion.choices[0].message.content;
};