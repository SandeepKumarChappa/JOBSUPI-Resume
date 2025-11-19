const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    author: String,
    message: String,
  },
  { timestamps: true }
);

const ResumeVersionSchema = new mongoose.Schema(
  {
    versionNumber: Number,
    editedBy: String,
    data: Object,
    pdfDownloadUrl: String,
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    profileSlug: { type: String, unique: true },
    versions: [ResumeVersionSchema],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);


