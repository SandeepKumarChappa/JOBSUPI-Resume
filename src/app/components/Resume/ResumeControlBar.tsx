"use client";
import { useEffect, useMemo, useState } from "react";
import { useSetDefaultScale } from "components/Resume/hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  QrCodeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import { resumeClient } from "lib/api/resumeClient";
import QRCode from "qrcode";
import Image from "next/image";
import { useAppDispatch } from "lib/redux/hooks";
import { changeProfile, setResume } from "lib/redux/resumeSlice";
import type { Resume } from "lib/redux/types";

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
  resume,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
  resume: Resume;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document });
  const dispatch = useAppDispatch();
  const [cloudStatus, setCloudStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [cloudMessage, setCloudMessage] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [showQrCard, setShowQrCard] = useState(false);
  const [versions, setVersions] = useState<
    { versionNumber: number; timestamp: string; editedBy: string }[]
  >([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("latest");

  // Hook to update pdf when document changes
  useEffect(() => {
    update();
  }, [update, document]);

  const userId = resume.profile.email || resume.profile.phone || "";

  const shareBase = useMemo(() => {
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    }
    return process.env.NEXT_PUBLIC_SITE_URL || "";
  }, []);

  useEffect(() => {
    if (resume.profile.publicSlug && shareBase) {
      setPublicUrl(`${shareBase}/profile/${resume.profile.publicSlug}`);
    }
  }, [resume.profile.publicSlug, shareBase]);

  useEffect(() => {
    const loadVersions = async () => {
      if (!userId) return;
      try {
        const response = await resumeClient.listVersions(userId);
        setVersions(response.versions || []);
      } catch (error) {
        console.warn("Could not load versions", error);
      }
    };
    loadVersions();
  }, [userId]);

  const handleSaveToCloud = async () => {
    if (!userId) {
      setCloudStatus("error");
      setCloudMessage("Add email or phone first to enable sync.");
      return;
    }
    try {
      setCloudStatus("saving");
      const response = await resumeClient.save({
        userId,
        editedBy: resume.profile.name,
        resume,
        pdfDownloadUrl: instance.url,
      });
      setCloudStatus("saved");
      setCloudMessage(`Version ${response.versionNumber} saved`);
      if (response.profileSlug) {
        dispatch(changeProfile({ field: "publicSlug", value: response.profileSlug }));
        setPublicUrl(`${shareBase}/profile/${response.profileSlug}`);
      }
      const latestVersions = await resumeClient.listVersions(userId);
      setVersions(latestVersions.versions || []);
    } catch (error: any) {
      setCloudStatus("error");
      setCloudMessage(error.message);
    }
  };

  const handleVersionChange = async (value: string) => {
    setSelectedVersion(value);
    if (!userId || value === "latest") return;
    try {
      const response = await resumeClient.getVersion(userId, Number(value));
      dispatch(setResume(response.resume));
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateQR = async () => {
    if (!publicUrl) {
      setCloudMessage("Save once before generating QR.");
      setCloudStatus("error");
      return;
    }
    const qr = await QRCode.toDataURL(publicUrl, { margin: 1 });
    setQrDataUrl(qr);
    setShowQrCard(true);
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex flex-col gap-3 px-[var(--resume-padding)] py-3 text-gray-600 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((prev) => !prev)}
          />
          <span className="select-none">Autoscale</span>
        </label>
      </div>
      <div className="flex flex-1 flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-end">
        <a
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
          href={instance.url!}
          download={fileName}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Download PDF</span>
        </a>
        <button
          type="button"
          onClick={handleSaveToCloud}
          className="flex items-center gap-1 rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-white"
        >
          <CloudArrowUpIcon className="h-4 w-4" />
          {cloudStatus === "saving" ? "Saving..." : "Save version"}
        </button>
        <button
          type="button"
          onClick={handleGenerateQR}
          className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold"
        >
          <QrCodeIcon className="h-4 w-4" />
          Generate QR
        </button>
        {publicUrl && (
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-sky-600"
          >
            Public profile
          </a>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {versions.length > 0 && (
          <select
            value={selectedVersion}
            onChange={(e) => handleVersionChange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm"
          >
            <option value="latest">Latest version</option>
            {versions.map((version) => (
              <option
                key={version.versionNumber}
                value={version.versionNumber}
              >
                v{version.versionNumber} ·{" "}
                {new Date(version.timestamp).toLocaleDateString()}
              </option>
            ))}
          </select>
        )}
        {cloudMessage && (
          <span
            className={`text-sm ${
              cloudStatus === "error" ? "text-rose-600" : "text-green-600"
            }`}
          >
            {cloudMessage}
          </span>
        )}
      </div>
      {qrDataUrl && showQrCard && (
        <div className="fixed bottom-6 right-6 z-40 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="text-sm font-semibold text-gray-900">
              Mobile resume QR
            </div>
            <button
              type="button"
              aria-label="Close QR preview"
              onClick={() => setShowQrCard(false)}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-col items-center gap-2">
            <Image
              src={qrDataUrl}
              alt="Resume QR"
              width={128}
              height={128}
              className="rounded-lg"
              unoptimized
            />
            <p className="text-center text-xs text-gray-600">
              Scan to open{" "}
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 underline"
              >
                your public profile
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Load ResumeControlBar client side since it uses usePDF, which is a web specific API
 */
export const ResumeControlBarCSR = dynamic(
  () => Promise.resolve(ResumeControlBar),
  {
    ssr: false,
  }
);

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
