"use client";
import { useState, useRef } from "react";

const EXERCISES = ["Squat", "Deadlift", "Bench Press", "Overhead Press", "Romanian Deadlift", "Hip Thrust"];

export default function FormCheckUploader() {
  const [exercise, setExercise]   = useState("");
  const [file, setFile]           = useState(null);
  const [status, setStatus]       = useState("idle"); // idle | uploading | queued | error
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState("");
  const inputRef                  = useRef();

  async function handleUpload() {
    if (!file || !exercise) {
      setError("Please select an exercise and a video file.");
      return;
    }

    setStatus("uploading");
    setError("");

    try {
      // Step 1: Get presigned S3 upload URL from our API
      const res = await fetch("/api/formcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercise:    exercise.toLowerCase(),
          filename:    file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, formCheckId } = await res.json();

      // Step 2: Upload video DIRECTLY to S3 using the presigned URL
      // This means video bytes never hit our Next.js server
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload  = () => xhr.status === 200 ? resolve() : reject(new Error("S3 upload failed"));
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      // Step 3: Tell our API the upload is done — triggers the analysis queue job
      await fetch("/api/formcheck/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formCheckId }),
      });

      setStatus("queued");
      setFile(null);
      setExercise("");
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg">
      <h2 className="font-semibold text-gray-900 mb-4">Upload a video</h2>

      {status === "queued" ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🎉</div>
          <p className="font-medium text-gray-900 mb-1">Video uploaded!</p>
          <p className="text-sm text-gray-500">Claude AI is analysing your form. Check back in a few minutes.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-sm text-green-600 hover:underline"
          >
            Upload another
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Exercise</label>
            <select
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select exercise...</option>
              {EXERCISES.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Video file (max 100MB)</label>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          {status === "uploading" && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Uploading to S3...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={status === "uploading" || !file || !exercise}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {status === "uploading" ? "Uploading..." : "Upload for AI analysis 🎥"}
          </button>
        </div>
      )}
    </div>
  );
}
