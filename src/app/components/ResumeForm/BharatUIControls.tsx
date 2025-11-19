"use client";

import { BaseForm } from "components/ResumeForm/Form";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeSettings } from "lib/redux/settingsSlice";

export const BharatUIControls = () => {
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();

  const handleLocaleChange = (locale: "en" | "hi") => {
    dispatch(changeSettings({ field: "locale", value: locale }));
  };

  const handleFontScale = (value: string) => {
    dispatch(changeSettings({ field: "fontScale", value }));
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-base font-semibold text-gray-800">
            भाषा / Language:
          </span>
          <button
            type="button"
            onClick={() => handleLocaleChange("en")}
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              settings.locale === "en"
                ? "bg-sky-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLocaleChange("hi")}
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              settings.locale === "hi"
                ? "bg-sky-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            हिंदी
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-base font-semibold text-gray-800">
            Font size:
          </span>
          {["normal", "large", "xl"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleFontScale(size)}
              className={`rounded-full px-4 py-1 text-sm font-semibold capitalize ${
                settings.fontScale === size
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </BaseForm>
  );
};


