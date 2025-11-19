"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeSkills,
  addSectionInForm,
  selectWorkExperiences,
  selectEducations,
  selectProjects,
} from "lib/redux/resumeSlice";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { parseSpeechTranscript } from "lib/voice/parseSpeech";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { ShowForm } from "lib/redux/settingsSlice";
import type { AppDispatch } from "lib/redux/store";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const ensureSections = (
  currentLength: number,
  needed: number,
  form: ShowForm,
  dispatch: AppDispatch
) => {
  while (currentLength < needed) {
    dispatch(addSectionInForm({ form }));
    currentLength += 1;
  }
};

export const VoiceCaptureButton = () => {
  const dispatch = useAppDispatch();
  const workExperiences = useAppSelector(selectWorkExperiences);
  const educations = useAppSelector(selectEducations);
  const projects = useAppSelector(selectProjects);

  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const recognitionRef = useRef<any | null>(null);

  const hasSpeechAPISupport = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(
      window.SpeechRecognition || window.webkitSpeechRecognition
    );
  }, []);

  const applyParsedData = useCallback(
    (text: string) => {
      const parsed = parseSpeechTranscript(text);
      if (parsed.profile) {
        Object.entries(parsed.profile).forEach(([field, value]) => {
          if (!value) return;
          dispatch(
            changeProfile({ field: field as any, value: value as string })
          );
        });
      }

      if (parsed.workExperiences?.length) {
        ensureSections(
          workExperiences.length,
          parsed.workExperiences.length,
          "workExperiences",
          dispatch
        );
        parsed.workExperiences.forEach((experience, idx) => {
          Object.entries(experience).forEach(([field, value]) => {
            dispatch(
              changeWorkExperiences({
                idx,
                field: field as any,
                value: value as any,
              })
            );
          });
        });
      }

      if (parsed.educations?.length) {
        ensureSections(
          educations.length,
          parsed.educations.length,
          "educations",
          dispatch
        );
        parsed.educations.forEach((education, idx) => {
          Object.entries(education).forEach(([field, value]) => {
            dispatch(
              changeEducations({
                idx,
                field: field as any,
                value: value as any,
              })
            );
          });
        });
      }

      if (parsed.projects?.length) {
        ensureSections(projects.length, parsed.projects.length, "projects", dispatch);
        parsed.projects.forEach((project, idx) => {
          Object.entries(project).forEach(([field, value]) => {
            dispatch(
              changeProjects({
                idx,
                field: field as any,
                value: value as any,
              })
            );
          });
        });
      }

      if (parsed.skills?.descriptions?.length) {
        dispatch(
          changeSkills({
            field: "descriptions",
            value: parsed.skills.descriptions,
          })
        );
      }
    },
    [dispatch, educations.length, projects.length, workExperiences.length]
  );

  const handleStart = () => {
    if (!hasSpeechAPISupport) {
      setErrorMessage("Speech recognition is not supported in this browser.");
      return;
    }
    setErrorMessage("");
    const RecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new RecognitionClass();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const newTranscript = event.results[0][0].transcript;
      setTranscript(newTranscript);
      applyParsedData(newTranscript);
    };
    recognition.onerror = (event: any) => {
      setErrorMessage(event.error || "Unable to capture speech.");
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="rounded-xl border border-sky-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <MicrophoneIcon className="h-5 w-5 text-sky-500" />
        <h3 className="text-lg font-semibold">Speak your details</h3>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        Describe your experience, skills, education & contact details. We will
        autofill the form for you.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleStart}
          disabled={!hasSpeechAPISupport || isListening}
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isListening ? "Listening..." : "Start Recording"}
        </button>
        {isListening && (
          <button
            type="button"
            onClick={handleStop}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
          >
            Stop
          </button>
        )}
      </div>
      {transcript && (
        <p className="mt-2 text-sm text-gray-500">Heard: “{transcript}”</p>
      )}
      {errorMessage && (
        <p className="mt-2 text-sm text-rose-600">{errorMessage}</p>
      )}
    </div>
  );
};


