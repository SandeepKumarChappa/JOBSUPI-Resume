"use client";

import { VoiceCaptureButton } from "components/MultiModalAssistant/VoiceCaptureButton";
import { ConversationalBuilder } from "components/MultiModalAssistant/ConversationalBuilder";

export const MultiModalAssistant = () => {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-gradient-to-b from-slate-50 to-white p-4">
      <h2 className="text-2xl font-bold text-gray-900">
        Bharat Assist (Voice + Chat)
      </h2>
      <p className="text-sm text-gray-600">
        Prefer speaking or chatting? Answer in English or Hindi, one question at
        a time.
      </p>
      <VoiceCaptureButton />
      <ConversationalBuilder />
    </section>
  );
};


