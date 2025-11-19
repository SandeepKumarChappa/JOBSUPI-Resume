"use client";

import { useState } from "react";
import { aiClient } from "lib/api/resumeClient";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeProfile,
  changeSkills,
  selectResume,
} from "lib/redux/resumeSlice";

export const AIEnhancerPanel = () => {
  const resume = useAppSelector(selectResume);
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<"idle" | "working">("idle");
  const [error, setError] = useState("");
  const [translatedSummary, setTranslatedSummary] = useState("");

  const runWithStatus = async (callback: () => Promise<void>) => {
    try {
      setStatus("working");
      setError("");
      await callback();
    } catch (err: any) {
      setError(err.message || "Unable to complete AI request");
    } finally {
      setStatus("idle");
    }
  };

  const handleSummarize = () =>
    runWithStatus(async () => {
      const resumeText = JSON.stringify(resume);
      const result = await aiClient.summarize(resumeText);
      if (result.summary) {
        dispatch(changeProfile({ field: "summary", value: result.summary }));
      }
    });

  const handleInferSkills = () =>
    runWithStatus(async () => {
      const text = [
        resume.profile.summary,
        ...resume.workExperiences.flatMap((exp) => exp.descriptions),
      ].join("\n");
      const result = await aiClient.inferSkills(text);
      if (result.skills?.length) {
        dispatch(
          changeSkills({ field: "descriptions", value: result.skills.slice(0, 10) })
        );
      }
    });

  const handleTranslate = (language: string) =>
    runWithStatus(async () => {
      const text = resume.profile.summary;
      const result = await aiClient.translate(text, language);
      if (result.translated) {
        setTranslatedSummary(result.translated);
        dispatch(changeProfile({ field: "summary", value: result.translated }));
      }
    });

  return (
    <section className="rounded-xl border border-purple-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold text-purple-700">
            AI Enhancements
          </h3>
          <p className="text-sm text-gray-600">
            Summarize, infer skills, or translate your resume with one tap.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSummarize}
            disabled={status === "working"}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Auto Summarize
          </button>
          <button
            type="button"
            onClick={handleInferSkills}
            disabled={status === "working"}
            className="rounded-md border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700"
          >
            Infer Skills
          </button>
          <button
            type="button"
            onClick={() => handleTranslate("Hindi")}
            disabled={status === "working"}
            className="rounded-md border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700"
          >
            Translate → Hindi
          </button>
          <button
            type="button"
            onClick={() => handleTranslate("English")}
            disabled={status === "working"}
            className="rounded-md border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700"
          >
            Translate → English
          </button>
        </div>
        {translatedSummary && (
          <div className="rounded-lg bg-purple-50 p-3 text-sm text-purple-900">
            {translatedSummary}
          </div>
        )}
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>
    </section>
  );
};


