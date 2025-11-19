"use client";

import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeSkills,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";

type Question = {
  id: string;
  prompt: { en: string; hi: string };
  placeholder: string;
  handler: (answer: string, context: HandlerContext) => void;
};

type HandlerContext = {
  dispatch: ReturnType<typeof useAppDispatch>;
};

const QUESTIONS: Question[] = [
  {
    id: "name",
    prompt: { en: "What is your name?", hi: "आपका नाम क्या है?" },
    placeholder: "My name is Laverne Lindsey",
    handler: (answer, { dispatch }) => {
      dispatch(changeProfile({ field: "name", value: answer.trim() }));
    },
  },
  {
    id: "experience",
    prompt: {
      en: "What work have you done before?",
      hi: "आपने पहले क्या कार्य किया है?",
    },
    placeholder: "I worked at Amazon as an SDE from 2021 to 2023",
    handler: (answer, { dispatch }) => {
      const parsed = parseExperienceAnswer(answer);
      Object.entries(parsed).forEach(([field, value]) => {
        dispatch(
          changeWorkExperiences({
            idx: 0,
            field: field as keyof ResumeWorkExperience,
            value: value as any,
          })
        );
      });
    },
  },
  {
    id: "skills",
    prompt: {
      en: "What skills do you have?",
      hi: "आपके कौशल क्या हैं?",
    },
    placeholder: "JavaScript, Java, Microservices, Mentoring",
    handler: (answer, { dispatch }) => {
      const skills = answer
        .split(/,|और|and/i)
        .map((skill) => skill.trim())
        .filter(Boolean);
      dispatch(changeSkills({ field: "descriptions", value: skills }));
    },
  },
  {
    id: "education",
    prompt: {
      en: "What education do you have?",
      hi: "आपकी शिक्षा क्या है?",
    },
    placeholder: "B.Tech in CSE from IIT Bombay, 2020",
    handler: (answer, { dispatch }) => {
      const [degree, schoolWithDate] = answer.split(" in ");
      const [school, date] = (schoolWithDate || "").split(",").map((s) => s.trim());
      dispatch(
        changeEducations({
          idx: 0,
          field: "degree",
          value: degree ? degree.trim() : answer.trim(),
        })
      );
      dispatch(
        changeEducations({
          idx: 0,
          field: "school",
          value: school || "",
        })
      );
      dispatch(
        changeEducations({
          idx: 0,
          field: "date",
          value: date || "",
        })
      );
    },
  },
  {
    id: "summary",
    prompt: {
      en: "How would you summarize yourself?",
      hi: "अपने बारे में संक्षेप में बताएं।",
    },
    placeholder: "Product-focused engineer building accessible tools",
    handler: (answer, { dispatch }) => {
      dispatch(changeProfile({ field: "summary", value: answer }));
    },
  },
];

const parseExperienceAnswer = (
  answer: string
): Partial<ResumeWorkExperience> => {
  const companyMatch = answer.match(/at\s+([A-Za-z0-9\s]+)/i);
  const titleMatch = answer.match(/as\s+([A-Za-z0-9\s]+)/i);
  const dateMatch = answer.match(/from\s+(.+)/i);
  return {
    company: companyMatch ? companyMatch[1].trim() : answer.trim(),
    jobTitle: titleMatch ? titleMatch[1].trim() : "",
    date: dateMatch ? dateMatch[1].trim() : "",
    descriptions: [answer.trim()],
  };
};

export const ConversationalBuilder = () => {
  const dispatch = useAppDispatch();
  const locale = useAppSelector((state) => state.settings.locale ?? "en");

  const [messages, setMessages] = useState<
    { id: string; sender: "bot" | "user"; text: string }[]
  >([
    {
      id: "welcome",
      sender: "bot",
      text: locale === "hi"
        ? "चलिये, आपकी जानकारी एक-एक करके भरते हैं।"
        : "Let's fill your resume one question at a time.",
    },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const promptText = useMemo(() => {
    if (!currentQuestion) return "";
    return currentQuestion.prompt[locale] || currentQuestion.prompt.en;
  }, [currentQuestion, locale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || !answer.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: `q-${currentQuestion.id}`, sender: "bot", text: promptText },
      { id: `a-${currentQuestion.id}`, sender: "user", text: answer },
    ]);

    currentQuestion.handler(answer, { dispatch });
    setAnswer("");
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, QUESTIONS.length));
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-amber-700">
        Guided chat builder
      </h3>
      <div className="mt-3 flex max-h-60 flex-col gap-2 overflow-y-auto rounded-lg bg-amber-50 p-3 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`rounded-2xl px-3 py-2 ${
                msg.sender === "user"
                  ? "bg-sky-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {currentQuestion && (
          <div className="text-amber-900">{promptText}</div>
        )}
        {!currentQuestion && (
          <div className="font-semibold text-green-600">
            All done! You can keep editing the form below.
          </div>
        )}
      </div>

      {currentQuestion && (
        <form className="mt-3 flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="rounded-md border border-amber-200 px-3 py-2 text-base focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
          >
            {locale === "hi" ? "जमा करें" : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};


