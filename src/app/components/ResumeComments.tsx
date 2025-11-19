"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectProfile } from "lib/redux/resumeSlice";
import { resumeClient } from "lib/api/resumeClient";

type Comment = {
  _id?: string;
  author?: string;
  message: string;
  createdAt?: string;
};

export const ResumeComments = () => {
  const profile = useAppSelector(selectProfile);
  const userId = profile.email || profile.phone;
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      if (!userId) return;
      try {
        const response = await resumeClient.getComments(userId);
        setComments(response.comments || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [userId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !userId) return;
    try {
      setStatus("loading");
      const response = await resumeClient.addComment({
        userId,
        author: profile.name || "You",
        message: newComment.trim(),
      });
      setComments(response.comments || []);
      setNewComment("");
      setStatus("idle");
    } catch (err: any) {
      setError(err.message);
      setStatus("idle");
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Comments & Notes
          </h3>
          <p className="text-sm text-gray-500">
            Share feedback like “Add skills” or “Update phone number”.
          </p>
        </div>
      </div>
      <div className="mt-3 space-y-3">
        {comments.map((comment) => (
          <div
            key={comment._id || comment.createdAt}
            className="rounded-lg bg-gray-50 p-3 text-sm text-gray-800"
          >
            <div className="font-semibold">
              {comment.author || "Reviewer"}
            </div>
            <p>{comment.message}</p>
            {comment.createdAt && (
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a quick note..."
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="button"
          onClick={handleAddComment}
          disabled={!userId || status === "loading"}
          className="self-end rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {status === "loading" ? "Saving..." : "Add Comment"}
        </button>
      </div>
      {!userId && (
        <p className="mt-2 text-xs text-gray-500">
          Enter an email or phone number to enable cloud comments.
        </p>
      )}
    </section>
  );
};


