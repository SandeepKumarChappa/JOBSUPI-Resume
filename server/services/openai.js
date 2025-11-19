const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY;
const modelName =
  process.env.GEMINI_MODEL ||
  process.env.OPENAI_MODEL ||
  "gemini-1.5-flash";

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: modelName }) : null;

const safeCall = async (prompt) => {
  if (!model) {
    return null;
  }
  const result = await model.generateContent(prompt);
  return result?.response?.text?.().trim();
};

const summarizeProfile = async (resumeText) => {
  return safeCall(
    `Write a concise two-sentence professional resume summary highlighting the most impressive accomplishments from this profile:\n${resumeText}`
  );
};

const inferSkills = async (text) => {
  const content = await safeCall(
    `Extract a comma-separated list of core skills mentioned in this resume text. Respond with only the comma separated skills list:\n${text}`
  );

  return content
    ?.split(/,|\n|-/)
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const translateResume = async (text, targetLanguage) => {
  return safeCall(
    `Translate the following resume summary into ${targetLanguage}. Respond with only the translated text:\n${text}`
  );
};

module.exports = {
  summarizeProfile,
  inferSkills,
  translateResume,
};


