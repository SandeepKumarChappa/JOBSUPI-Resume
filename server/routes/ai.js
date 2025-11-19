const express = require("express");
const {
  summarizeProfile,
  inferSkills,
  translateResume,
} = require("../services/openai");

const router = express.Router();

router.post("/summarize", async (req, res) => {
  try {
    const { resumeText } = req.body;
    const summary = await summarizeProfile(resumeText || "");
    if (!summary) {
      return res
        .status(503)
        .json({ message: "AI key missing. Set GOOGLE_API_KEY." });
    }
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to summarize profile" });
  }
});

router.post("/skills", async (req, res) => {
  try {
    const { text } = req.body;
    const skills = await inferSkills(text || "");
    if (!skills) {
      return res
        .status(503)
        .json({ message: "AI key missing. Set GOOGLE_API_KEY." });
    }
    res.json({ skills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to infer skills" });
  }
});

router.post("/translate", async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    const translated = await translateResume(text || "", targetLanguage || "Hindi");
    if (!translated) {
      return res
        .status(503)
        .json({ message: "AI key missing. Set GOOGLE_API_KEY." });
    }
    res.json({ translated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to translate resume" });
  }
});

module.exports = router;


