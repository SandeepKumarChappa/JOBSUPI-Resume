"use client";

import type {
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
} from "lib/redux/types";

export interface ParsedVoiceResume {
  profile?: Partial<ResumeProfile>;
  workExperiences?: ResumeWorkExperience[];
  educations?: ResumeEducation[];
  projects?: ResumeProject[];
  skills?: Partial<ResumeSkills>;
}

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_REGEX =
  /(\+?\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/i;

export const parseSpeechTranscript = (
  transcript: string
): ParsedVoiceResume => {
  const lower = transcript.toLowerCase();
  const profile: Partial<ResumeProfile> = {};

  const nameMatch = transcript.match(/my name is ([a-z\s]+)/i);
  if (nameMatch) {
    profile.name = capitalizeWords(nameMatch[1].trim());
  }

  const locationMatch = transcript.match(/based in ([a-z\s]+)/i);
  if (locationMatch) {
    profile.location = capitalizeWords(locationMatch[1].trim());
  }

  const summaryCandidate = transcript.split(/[.]/)[0];
  if (summaryCandidate) {
    profile.summary = summaryCandidate.trim();
  }

  const emailMatch = transcript.match(EMAIL_REGEX);
  if (emailMatch) {
    profile.email = emailMatch[0];
  }

  const phoneMatch = transcript.match(PHONE_REGEX);
  if (phoneMatch) {
    profile.phone = phoneMatch[0];
  }

  if (lower.includes("years of experience")) {
    const years = transcript.match(/(\d+)\s+years of experience/i);
    if (years) {
      profile.experienceYears = years[1];
    }
  }

  const workExperiences = extractWorkExperiences(transcript);
  const educations = extractEducations(transcript);
  const skills = extractSkills(transcript);
  const projects = extractProjects(transcript);

  return {
    profile,
    workExperiences,
    educations,
    projects,
    skills,
  };
};

const extractSkills = (transcript: string): Partial<ResumeSkills> => {
  const skillsMatch = transcript.match(
    /(skills|expertise|tech stack)\s*(include|includes|are|:)\s*(.*)/i
  );
  if (!skillsMatch) return {};

  const after = skillsMatch[3];
  const descriptions = after
    .split(/,|and/)
    .map((skill) => skill.trim())
    .filter(Boolean);
  return { descriptions };
};

const extractProjects = (transcript: string): ResumeProject[] => {
  const sentences = transcript.split(".");
  const projects: ResumeProject[] = [];
  sentences.forEach((sentence) => {
    if (sentence.toLowerCase().includes("project")) {
      projects.push({
        project: capitalizeWords(sentence.split("project")[0].trim()),
        date: "",
        descriptions: [sentence.trim()],
      });
    }
  });
  return projects;
};

const extractEducations = (transcript: string): ResumeEducation[] => {
  const matches = transcript.matchAll(
    /(studied at|graduated from)\s+([a-z\s]+)(?:\s+with\s+a\s+([a-z\s]+))?/gi
  );
  const educations: ResumeEducation[] = [];
  for (const match of matches) {
    educations.push({
      school: capitalizeWords(match[2].trim()),
      degree: match[3] ? capitalizeWords(match[3].trim()) : "",
      date: "",
      gpa: "",
      descriptions: [],
    });
  }
  return educations;
};

const extractWorkExperiences = (
  transcript: string
): ResumeWorkExperience[] => {
  const matches = transcript.matchAll(
    /(worked|experience)\s*(?:at|with|for)?\s*([a-z\s]+?)(?: as ([a-z\s]+))?(?: from ([^,]+))?(?:,|\.|$)/gi
  );
  const experiences: ResumeWorkExperience[] = [];
  for (const match of matches) {
    experiences.push({
      company: capitalizeWords((match[2] || "").trim()),
      jobTitle: capitalizeWords((match[3] || "").trim()),
      date: (match[4] || "").trim(),
      descriptions: [
        match[0]
          .replace(/worked|experience/gi, "")
          .replace(/at|with|for/gi, "")
          .trim(),
      ],
    });
  }
  return experiences;
};

const capitalizeWords = (value: string) =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());


