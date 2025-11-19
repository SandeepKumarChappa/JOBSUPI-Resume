"use client";

import { useCallback } from "react";
import { useAppSelector } from "lib/redux/hooks";

const translations: Record<string, { hi: string }> = {
  Name: { hi: "नाम" },
  Objective: { hi: "उद्देश्य" },
  Email: { hi: "ईमेल" },
  Phone: { hi: "फ़ोन" },
  Website: { hi: "वेबसाइट" },
  Location: { hi: "स्थान" },
  "Years of Experience": { hi: "कुल अनुभव (वर्ष)" },
  "Profile Photo": { hi: "प्रोफ़ाइल फोटो" },
  Summary: { hi: "सारांश" },
  "Job Title": { hi: "पद नाम" },
  Company: { hi: "कंपनी" },
  Date: { hi: "तारीख" },
  "Description": { hi: "विवरण" },
  "Add Project": { hi: "प्रोजेक्ट जोड़ें" },
  "Add Work Experience": { hi: "काम का अनुभव जोड़ें" },
  "Add Education": { hi: "शिक्षा जोड़ें" },
  "Add Portfolio Item": { hi: "पोर्टफोलियो जोड़ें" },
  "Portfolio Title": { hi: "पोर्टफोलियो शीर्षक" },
  URL: { hi: "यूआरएल" },
  "Media Type": { hi: "मीडिया प्रकार" },
  "Thumbnail URL (optional)": { hi: "थंबनेल यूआरएल (वैकल्पिक)" },
  Highlights: { hi: "मुख्य बिंदु" },
  Skills: { hi: "कौशल" },
  "Featured Skills": { hi: "मुख्य कौशल" },
};

export const useLabels = () => {
  const locale = useAppSelector((state) => state.settings.locale ?? "en");

  const t = useCallback(
    (label: string) => {
      if (locale === "hi" && translations[label]) {
        return translations[label].hi;
      }
      return label;
    },
    [locale]
  );

  return { t, locale };
};


