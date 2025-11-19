"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { resumeClient } from "lib/api/resumeClient";
import type { Resume } from "lib/redux/types";

export default function PublicProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [resume, setResume] = useState<Resume | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await resumeClient.getPublicProfile(slug);
        setResume(response.resume);
      } catch (err: any) {
        setError(err.message || "Unable to load profile");
      }
    };
    load();
  }, [slug]);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-rose-600">{error}</p>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-gray-600">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <section className="rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center gap-4">
          {resume.profile.photoDataUrl && (
            <Image
              src={resume.profile.photoDataUrl}
              alt={resume.profile.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
              unoptimized
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {resume.profile.name}
            </h1>
            <p className="text-gray-600">{resume.profile.summary}</p>
            <div className="mt-2 text-sm text-gray-500">
              <p>{resume.profile.location}</p>
              <p>{resume.profile.email}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          Work Experience
        </h2>
        <div className="space-y-4">
          {resume.workExperiences.map((exp, idx) => (
            <div key={idx}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-lg font-semibold text-gray-900">
                  {exp.jobTitle} · {exp.company}
                </p>
                <p className="text-sm text-gray-500">{exp.date}</p>
              </div>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {exp.descriptions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Skills</h2>
        <ul className="flex flex-wrap gap-2 text-sm text-gray-700">
          {resume.skills.descriptions.map((skill, idx) => (
            <li
              key={idx}
              className="rounded-full border border-gray-200 px-3 py-1"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}


