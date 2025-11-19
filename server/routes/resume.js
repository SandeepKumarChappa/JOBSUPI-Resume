const express = require("express");
const crypto = require("crypto");
const Resume = require("../models/Resume");

const router = express.Router();

const makeSlug = (value = "") => {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const randomSuffix = crypto.randomBytes(2).toString("hex");
  return `${cleaned || "profile"}-${randomSuffix}`;
};

router.post("/save", async (req, res) => {
  try {
    const { userId, editedBy, resume, pdfDownloadUrl } = req.body;
    if (!userId || !resume) {
      return res.status(400).json({ message: "userId and resume are required" });
    }

    const existing = await Resume.findOne({ userId });
    const versionNumber = existing ? existing.versions.length + 1 : 1;
    const profileSlug =
      resume?.profile?.publicSlug ||
      existing?.profileSlug ||
      makeSlug(resume?.profile?.name);

    const versionPayload = {
      versionNumber,
      editedBy: editedBy || resume?.profile?.name || "Unknown",
      data: resume,
      pdfDownloadUrl: pdfDownloadUrl || "",
    };

    let result;
    if (existing) {
      existing.versions.push(versionPayload);
      existing.profileSlug = profileSlug;
      result = await existing.save();
    } else {
      result = await Resume.create({
        userId,
        profileSlug,
        versions: [versionPayload],
        comments: [],
      });
    }

    return res.json({
      message: "Resume saved",
      versionNumber,
      profileSlug,
      resumeId: result._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to save resume" });
  }
});

router.get("/list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const resumeDoc = await Resume.findOne({ userId });
    if (!resumeDoc) {
      return res.json({ versions: [] });
    }

    const versions = resumeDoc.versions.map((version) => ({
      versionNumber: version.versionNumber,
      timestamp: version.timestamp,
      editedBy: version.editedBy,
      pdfDownloadUrl: version.pdfDownloadUrl,
    }));

    res.json({ versions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to list versions" });
  }
});

router.get("/version", async (req, res) => {
  try {
    const { userId, versionNumber } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const resumeDoc = await Resume.findOne({ userId });
    if (!resumeDoc) {
      return res.status(404).json({ message: "Resume not found" });
    }

    let version;
    if (versionNumber) {
      version = resumeDoc.versions.find(
        (ver) => ver.versionNumber === Number(versionNumber)
      );
    } else {
      version = resumeDoc.versions[resumeDoc.versions.length - 1];
    }

    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    res.json({ resume: version.data, versionNumber: version.versionNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch resume version" });
  }
});

router.post("/comments", async (req, res) => {
  try {
    const { userId, author, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ message: "userId and message required" });
    }
    const resumeDoc = await Resume.findOne({ userId });
    if (!resumeDoc) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resumeDoc.comments.push({ author, message });
    await resumeDoc.save();
    res.json({ comments: resumeDoc.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to add comment" });
  }
});

router.get("/comments/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const resumeDoc = await Resume.findOne({ userId });
    if (!resumeDoc) {
      return res.json({ comments: [] });
    }
    res.json({ comments: resumeDoc.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch comments" });
  }
});

router.get("/public/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const resumeDoc = await Resume.findOne({ profileSlug: slug });
    if (!resumeDoc) {
      return res.status(404).json({ message: "Public profile not found" });
    }
    const latest = resumeDoc.versions[resumeDoc.versions.length - 1];
    res.json({
      resume: latest.data,
      versionNumber: latest.versionNumber,
      slug: resumeDoc.profileSlug,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load public profile" });
  }
});

module.exports = router;


